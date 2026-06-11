"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import styles from "./style.module.scss";
import { getAppStoreUrl } from "@/utils/getAppStoreUrl";
import {
  buildDefaultAnswers,
  canUseBrowserJoinFlow,
  createFlowState,
  EVENT_CARD,
  FLOW_VIEW,
  inviteFlowReducer,
} from "./machine";
import { GRADIENT_CSS, OTP_LENGTH } from "./constants";
import {
  buildMapSearchUrl,
  formatDetailDate,
  splitLocation,
  triggerDeepLink,
} from "./utils";
import ScreenFrame from "./shared/ScreenFrame";
import EventScreen from "./screens/EventScreen";
import PhoneScreen from "./screens/PhoneScreen";
import NameScreen from "./screens/NameScreen";
import OtpScreen from "./screens/OtpScreen";
import QuestionsScreen from "./screens/QuestionsScreen";
import ResultScreen from "./screens/ResultScreen";
import {
  completeWebSession,
  createWebSession,
  fetchWebIdentityStatus,
  fetchWebInvite,
  normalizeInviteDetail,
  resultStatusToEventCard,
  resultStatusToResultKind,
  submitWebAnswers,
  updateWebRsvp,
} from "./api";
import { useWebPhoneAuth } from "./useWebPhoneAuth";

export default function InviteFlow({ slug, inviteCode }) {
  const [invite, setInvite] = useState(null);
  const [webSession, setWebSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [actionError, setActionError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifiedClerkUserId, setVerifiedClerkUserId] = useState(null);
  const [joinedAsName, setJoinedAsName] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [flowState, dispatch] = useReducer(inviteFlowReducer, undefined, createFlowState);
  const webPhoneAuth = useWebPhoneAuth();

  const isShareMode = Boolean(slug);
  const isRsvpModalOpen = flowState.view === FLOW_VIEW.EVENT &&
    flowState.eventCard === EVENT_CARD.RSVP;

  const showError = useCallback((message) => {
    setActionError(message || "Something went wrong. Please try again.");
  }, []);

  const handleStoreOpen = useCallback(() => {
    window.open(getAppStoreUrl(), "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadInvite() {
      if (slug && !webPhoneAuth.isLoaded) return;

      setLoading(true);
      setError(null);

      try {
        if (!slug) throw new Error("Missing invite link");

        const payload = await fetchWebInvite({
          slug,
          inviteCode,
          clerkUserId: webPhoneAuth.clerkUserId,
        });
        if (!alive) return;
        setInvite(normalizeInviteDetail(payload));
        setWebSession(payload.restored_session || null);
        const restoredEventCard = resultStatusToEventCard(
          payload.restored_session?.result_status,
        );
        if (restoredEventCard) {
          dispatch({
            type: "RESTORE_EVENT_CARD",
            eventCard: restoredEventCard,
          });
        }
      } catch (err) {
        if (!alive) return;
        setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadInvite();

    return () => {
      alive = false;
    };
  }, [
    inviteCode,
    reloadToken,
    slug,
    webPhoneAuth.clerkUserId,
    webPhoneAuth.isLoaded,
  ]);

  useEffect(() => {
    if (!isRsvpModalOpen) return undefined;

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [isRsvpModalOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timerId = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timerId);
  }, [resendCooldown]);

  const joinQuestions = useMemo(
    () => invite?.join_questions ?? [],
    [invite],
  );
  const defaultAnswers = useMemo(
    () => buildDefaultAnswers(joinQuestions),
    [joinQuestions],
  );
  const canJoinOnWeb = canUseBrowserJoinFlow({ isShareMode, invite });

  const timeDate = invite?.time ? new Date(invite.time) : null;
  const detailDate = formatDetailDate(timeDate);
  const { venue, address } = splitLocation(invite?.location);
  const mapUrl = buildMapSearchUrl({ venue, address });

  const creatorById = invite?.creator_user_id
    ? invite.members?.find((member) => member.user_id === invite.creator_user_id)
    : null;
  const creator = creatorById ?? invite?.members?.[0] ?? null;
  const hostName = creator?.first_name || "the host";
  const displayMembers = invite?.members?.slice(0, 4) ?? [];
  const attendeeCount = invite?.member_count ?? invite?.members?.length ?? 0;
  const eventTitle = invite?.subject || "Wander event";

  const ensureWebSession = useCallback(async () => {
    if (webSession?.session_id) return webSession;
    if (!slug) return null;
    const payload = await createWebSession({ slug, inviteCode });
    setWebSession(payload.session);
    return payload.session;
  }, [inviteCode, slug, webSession]);

  const handleJoin = useCallback(async () => {
    if (pendingAction) return;
    setActionError("");

    if (!isShareMode) {
      handleStoreOpen();
      return;
    }

    if (canJoinOnWeb) {
      setPendingAction("join");
      try {
        await ensureWebSession();
        dispatch({ type: "OPEN_RSVP", defaultAnswers });
      } catch (err) {
        showError(err.message);
      } finally {
        setPendingAction(null);
      }
      return;
    }

    triggerDeepLink({
      slug,
      inviteCode,
      onFallback: () => {
        handleStoreOpen();
      },
    });
  }, [
    canJoinOnWeb,
    defaultAnswers,
    handleStoreOpen,
    ensureWebSession,
    inviteCode,
    isShareMode,
    pendingAction,
    showError,
    slug,
  ]);

  const handleContinueRsvp = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("rsvp");
    try {
      const session = await ensureWebSession();
      if (session?.session_id) {
        const payload = await updateWebRsvp({
          sessionId: session.session_id,
          rsvpStatus: flowState.rsvpIntent,
        });
        setWebSession(payload.session);
      }
      dispatch({ type: "CONTINUE_FROM_RSVP" });
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [ensureWebSession, flowState.rsvpIntent, pendingAction, showError]);

  const handleResultAction = useCallback(() => {
    if (
      flowState.resultKind === "approved" ||
      flowState.resultKind === "direct_join"
    ) {
      triggerDeepLink({
        slug,
        inviteCode,
        onFallback: handleStoreOpen,
      });
      return;
    }

    handleStoreOpen();
  }, [flowState.resultKind, handleStoreOpen, inviteCode, slug]);

  const completeFromBackend = useCallback(async (clerkUserId) => {
    const session = await ensureWebSession();
    if (!session?.session_id) {
      throw new Error("Missing web session");
    }

    if (!clerkUserId) {
      throw new Error("Missing verified Clerk user");
    }

    const payload = await completeWebSession({
      sessionId: session.session_id,
      clerkUserId,
      displayName: flowState.profile.name,
    });
    setWebSession(payload.session);
    return payload.session;
  }, [ensureWebSession, flowState.profile]);

  const continueAfterProfile = useCallback(async (clerkUserId) => {
    const hasQuestions =
      (flowState.rsvpIntent === "going" || flowState.rsvpIntent === "maybe") &&
      joinQuestions.length > 0;

    if (hasQuestions) {
      dispatch({ type: "CONTINUE_TO_QUESTIONS" });
      return;
    }

    const completedSession = await completeFromBackend(clerkUserId);
    dispatch({
      type: "APPLY_BACKEND_RESULT",
      resultKind: resultStatusToResultKind(completedSession?.result_status),
    });
  }, [
    completeFromBackend,
    flowState.rsvpIntent,
    joinQuestions.length,
  ]);

  const handleContinuePhone = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("phone");
    try {
      setVerifiedClerkUserId(null);
      setJoinedAsName("");
      await webPhoneAuth.startPhoneVerification({
        profile: flowState.profile,
      });
      setResendCooldown(60);
      dispatch({ type: "CONTINUE_FROM_PHONE" });
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [flowState.profile, pendingAction, showError, webPhoneAuth]);

  const handleContinueOtp = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("otp");
    try {
      const verified = await webPhoneAuth.verifyPhoneCode({
        code: flowState.otpCode,
      });
      setVerifiedClerkUserId(verified.clerkUserId);

      const session = await ensureWebSession();
      if (!session?.session_id) {
        throw new Error("Missing web session");
      }
      const identityPayload = await fetchWebIdentityStatus({
        sessionId: session.session_id,
        clerkUserId: verified.clerkUserId,
      });
      setWebSession(identityPayload.session);
      const identityResultKind = resultStatusToResultKind(
        identityPayload.session?.result_status,
      );
      if (identityResultKind) {
        dispatch({
          type: "APPLY_BACKEND_RESULT",
          resultKind: identityResultKind,
        });
        return;
      }

      const firstName = identityPayload.identity?.first_name || "";
      const needsProfile = identityPayload.identity?.needs_profile ?? !firstName;
      if (needsProfile) {
        dispatch({
          type: "CONTINUE_TO_NAME",
          name: firstName,
        });
        return;
      }

      if (firstName) {
        setJoinedAsName(firstName);
        dispatch({ type: "UPDATE_PROFILE", field: "name", value: firstName });
      }
      await continueAfterProfile(verified.clerkUserId);
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    continueAfterProfile,
    ensureWebSession,
    flowState.otpCode,
    pendingAction,
    showError,
    webPhoneAuth,
  ]);

  const handleContinueName = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("name");
    try {
      const session = await ensureWebSession();
      if (!session?.session_id) {
        throw new Error("Missing web session");
      }
      const clerkUserId = verifiedClerkUserId || webPhoneAuth.clerkUserId;
      if (!clerkUserId) {
        throw new Error("Missing verified Clerk user");
      }
      const identityPayload = await fetchWebIdentityStatus({
        sessionId: session.session_id,
        clerkUserId,
        displayName: flowState.profile.name,
      });
      setWebSession(identityPayload.session);
      const identityResultKind = resultStatusToResultKind(
        identityPayload.session?.result_status,
      );
      if (identityResultKind) {
        dispatch({
          type: "APPLY_BACKEND_RESULT",
          resultKind: identityResultKind,
        });
        return;
      }
      await continueAfterProfile(clerkUserId);
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    continueAfterProfile,
    ensureWebSession,
    flowState.profile.name,
    pendingAction,
    showError,
    verifiedClerkUserId,
    webPhoneAuth.clerkUserId,
  ]);

  const handleSubmitQuestions = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("questions");
    try {
      const session = await ensureWebSession();
      if (!session?.session_id) {
        throw new Error("Missing web session");
      }
      const clerkUserId = verifiedClerkUserId || webPhoneAuth.clerkUserId;
      if (!clerkUserId) {
        throw new Error("Missing verified Clerk user");
      }

      const answersPayload = await submitWebAnswers({
        sessionId: session.session_id,
        clerkUserId,
        questions: joinQuestions,
        answers: flowState.answers,
      });
      setWebSession(answersPayload.session);
      const completed = await completeFromBackend(clerkUserId);
      setWebSession(completed);
      dispatch({
        type: "APPLY_BACKEND_RESULT",
        resultKind: resultStatusToResultKind(completed?.result_status),
      });
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    ensureWebSession,
    flowState.answers,
    joinQuestions,
    pendingAction,
    showError,
    completeFromBackend,
    verifiedClerkUserId,
    webPhoneAuth.clerkUserId,
  ]);

  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.phoneShell}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className={styles.wrap}>
        <div className={styles.phoneShell}>
          <div className={styles.errorState}>
            <p>Failed to load group details</p>
            {error && <span>{error}</span>}
            <button
              type="button"
              className={styles.retryBtn}
              onClick={() => setReloadToken((current) => current + 1)}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.phoneShell}>
        <ScreenFrame>
          {flowState.view === FLOW_VIEW.EVENT && (
            <EventScreen
              styles={styles}
              gradientCss={GRADIENT_CSS}
              data={invite}
              eventTitle={eventTitle}
              detailDate={detailDate}
              venue={venue}
              address={address}
              mapUrl={mapUrl}
              creator={creator}
              hostName={hostName}
              attendeeCount={attendeeCount}
              displayMembers={displayMembers}
              eventCard={flowState.eventCard}
              selectedRsvp={flowState.rsvpIntent}
              onSelectRsvp={(rsvpIntent) =>
                dispatch({ type: "SELECT_RSVP", rsvpIntent })
              }
              onContinueRsvp={handleContinueRsvp}
              onJoin={handleJoin}
              onStoreOpen={handleStoreOpen}
              onResetToJoin={() => dispatch({ type: "RESET_TO_JOIN" })}
              isJoining={pendingAction === "join"}
              isSubmittingRsvp={pendingAction === "rsvp"}
              error={actionError}
            />
          )}

          {flowState.view === FLOW_VIEW.PHONE && (
            <PhoneScreen
              styles={styles}
              rsvpIntent={flowState.rsvpIntent}
              profile={flowState.profile}
              onBack={() => dispatch({ type: "BACK" })}
              onUpdateProfile={(field, value) =>
                dispatch({ type: "UPDATE_PROFILE", field, value })
              }
              onContinue={handleContinuePhone}
              isSubmitting={webPhoneAuth.pending || pendingAction === "phone"}
              error={webPhoneAuth.error || actionError}
              authReady={webPhoneAuth.isLoaded}
            />
          )}

          {flowState.view === FLOW_VIEW.NAME && (
            <NameScreen
              styles={styles}
              profile={flowState.profile}
              onBack={() => dispatch({ type: "BACK" })}
              onUpdateProfile={(field, value) =>
                dispatch({ type: "UPDATE_PROFILE", field, value })
              }
              onContinue={handleContinueName}
              isSubmitting={pendingAction === "name"}
              error={actionError}
            />
          )}

          {flowState.view === FLOW_VIEW.OTP && (
            <OtpScreen
              styles={styles}
              otpCode={flowState.otpCode}
              onBack={() => dispatch({ type: "BACK" })}
              onChangeCode={(otpCode) =>
                dispatch({ type: "UPDATE_OTP", otpCode })
              }
              onContinue={handleContinueOtp}
              onResend={async () => {
                if (resendCooldown > 0) return;
                setActionError("");
                try {
                  await webPhoneAuth.resendPhoneCode();
                  dispatch({ type: "UPDATE_OTP", otpCode: "" });
                  setResendCooldown(60);
                } catch (err) {
                  showError(err.message);
                }
              }}
              isSubmitting={webPhoneAuth.pending || pendingAction === "otp"}
              error={webPhoneAuth.error || actionError}
              resendCooldown={resendCooldown}
            />
          )}

          {flowState.view === FLOW_VIEW.QUESTIONS && (
            <QuestionsScreen
              styles={styles}
              questions={joinQuestions}
              answers={flowState.answers}
              hostName={hostName}
              onBack={() => dispatch({ type: "BACK" })}
              onUpdateAnswer={(questionId, value) =>
                dispatch({ type: "UPDATE_ANSWER", questionId, value })
              }
              onSubmit={handleSubmitQuestions}
              isSubmitting={pendingAction === "questions"}
              joinedAsName={joinedAsName}
              error={actionError}
            />
          )}

          {flowState.view === FLOW_VIEW.RESULT && (
            <ResultScreen
              styles={styles}
              resultKind={flowState.resultKind}
              hostName={hostName}
              onContinue={handleResultAction}
              joinedAsName={joinedAsName}
            />
          )}
        </ScreenFrame>
      </div>
    </div>
  );
}
