"use client";

import { useCallback, useMemo, useState } from "react";
import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/nextjs";

function clerkErrorMessage(error) {
  const firstError = error?.errors?.[0];
  return (
    firstError?.longMessage ||
    firstError?.message ||
    error?.message ||
    "Phone verification failed. Please try again."
  );
}

function logClerkError(scope, error) {
  if (process.env.NODE_ENV === "production") return;
  const payload = {
    message: error?.message,
    status: error?.status,
    clerkTraceId: error?.clerkTraceId,
    errors: error?.errors?.map?.((item) => ({
      code: item?.code,
      message: item?.message,
      longMessage: item?.longMessage,
      meta: item?.meta,
    })),
  };
  console.error(`[web-phone-auth] ${scope}`, payload, error);
}

function isAccountNotFound(error) {
  const message = clerkErrorMessage(error).toLowerCase();
  return (
    message.includes("couldn't find your account") ||
    message.includes("could not find your account") ||
    message.includes("not found") ||
    message.includes("identifier is invalid") ||
    error?.errors?.some?.((item) =>
      String(item?.code || "").includes("identifier_not_found") ||
      String(item?.code || "").includes("identifier_invalid"),
    )
  );
}

function isIdentifierTaken(error) {
  const message = clerkErrorMessage(error).toLowerCase();
  return (
    message.includes("already exists") ||
    message.includes("already been taken") ||
    message.includes("is taken") ||
    error?.errors?.some?.((item) => {
      const code = String(item?.code || "");
      return code.includes("form_identifier_exists") || code.includes("already_exists");
    })
  );
}

function getPhoneCodeFactor(signInAttempt) {
  const factor = signInAttempt?.supportedFirstFactors?.find(
    (item) => item?.strategy === "phone_code" && item?.phoneNumberId,
  );
  if (!factor) {
    throw new Error("Phone code sign-in is not available for this account");
  }
  return factor;
}

export function toE164Phone(profile) {
  const digits = String(profile?.phoneDigits || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return "";
  return `+1${digits}`;
}

async function waitForActiveUserId(clerk, fallbackUserId) {
  if (fallbackUserId) return fallbackUserId;

  for (let index = 0; index < 20; index += 1) {
    const activeUserId =
      clerk?.user?.id ||
      (typeof window !== "undefined" ? window.Clerk?.user?.id : null);
    if (activeUserId) return activeUserId;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
}

export function useWebPhoneAuth() {
  const clerk = useClerk();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser();
  const [mode, setMode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const isLoaded = signInLoaded && signUpLoaded && userLoaded;
  const clerkUserId = user?.id || null;

  const startPhoneVerification = useCallback(
    async ({ profile }) => {
      if (!isLoaded) {
        throw new Error("Authentication is still loading");
      }

      const fullPhoneNumber = toE164Phone(profile);
      if (!fullPhoneNumber) {
        throw new Error("Enter a valid US or Canada phone number");
      }

      setPending(true);
      setError("");
      setPhoneNumber(fullPhoneNumber);
      setPhoneNumberId("");

      try {
        try {
          const signInAttempt = await signIn.create({
            identifier: fullPhoneNumber,
          });
          const phoneFactor = getPhoneCodeFactor(signInAttempt);
          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId: phoneFactor.phoneNumberId,
          });
          setPhoneNumberId(phoneFactor.phoneNumberId);
          setMode("sign_in");
          return { mode: "sign_in", phoneNumber: fullPhoneNumber };
        } catch (signInError) {
          logClerkError("sign-in start failed", signInError);
          if (!isAccountNotFound(signInError)) {
            throw signInError;
          }

          try {
            await signUp.create({
              phoneNumber: fullPhoneNumber,
              firstName: profile?.name?.trim() || undefined,
            });
          } catch (signUpError) {
            logClerkError("sign-up start failed", signUpError);
            if (isIdentifierTaken(signUpError)) {
              throw new Error(
                "This phone number already has an account, but phone-code sign-in is not enabled for it.",
              );
            }
            throw signUpError;
          }
          await signUp.preparePhoneNumberVerification({
            strategy: "phone_code",
          });
          setMode("sign_up");
          return { mode: "sign_up", phoneNumber: fullPhoneNumber };
        }
      } catch (err) {
        logClerkError("start phone verification failed", err);
        const message = clerkErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setPending(false);
      }
    },
    [isLoaded, signIn, signUp],
  );

  const verifyPhoneCode = useCallback(
    async ({ code }) => {
      if (!isLoaded) {
        throw new Error("Authentication is still loading");
      }
      if (!mode) {
        throw new Error("Start phone verification first");
      }

      setPending(true);
      setError("");

      try {
        const result =
          mode === "sign_up"
            ? await signUp.attemptPhoneNumberVerification({ code })
            : await signIn.attemptFirstFactor({
                strategy: "phone_code",
                code,
              });

        if (result?.status !== "complete") {
          throw new Error("Verification incomplete");
        }

        const sessionId = result.createdSessionId;
        if (sessionId) {
          const setActive = mode === "sign_up" ? setSignUpActive : setSignInActive;
          await setActive({ session: sessionId });
        }

        const activeUserId = await waitForActiveUserId(
          clerk,
          result.createdUserId || user?.id || null,
        );
        if (!activeUserId) {
          throw new Error("Could not load verified user");
        }

        return { clerkUserId: activeUserId };
      } catch (err) {
        logClerkError("verify phone code failed", err);
        const message = clerkErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setPending(false);
      }
    },
    [
      isLoaded,
      clerk,
      mode,
      setSignInActive,
      setSignUpActive,
      signIn,
      signUp,
      user?.id,
    ],
  );

  const resendPhoneCode = useCallback(async () => {
    if (!isLoaded || !mode || !phoneNumber) return;

    setPending(true);
    setError("");

    try {
      if (mode === "sign_up") {
        await signUp.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
      } else {
        let currentPhoneNumberId = phoneNumberId;
        if (!currentPhoneNumberId) {
          const signInAttempt = await signIn.create({
            identifier: phoneNumber,
          });
          const phoneFactor = getPhoneCodeFactor(signInAttempt);
          currentPhoneNumberId = phoneFactor.phoneNumberId;
          setPhoneNumberId(currentPhoneNumberId);
        }
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId: currentPhoneNumberId,
        });
      }
    } catch (err) {
      logClerkError("resend phone code failed", err);
      const message = clerkErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setPending(false);
    }
  }, [isLoaded, mode, phoneNumber, phoneNumberId, signIn, signUp]);

  return useMemo(
    () => ({
      isLoaded,
      pending,
      error,
      phoneNumber,
      clerkUserId,
      startPhoneVerification,
      verifyPhoneCode,
      resendPhoneCode,
    }),
    [
      clerkUserId,
      error,
      isLoaded,
      pending,
      phoneNumber,
      resendPhoneCode,
      startPhoneVerification,
      verifyPhoneCode,
    ],
  );
}
