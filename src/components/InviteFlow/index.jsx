"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
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
  buildInviteShareUrl,
  buildMapSearchUrl,
  copyToClipboard,
  detectInAppBrowser,
  formatDetailDate,
  getPhoneCountry,
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
import {
  resultTriggerPage,
} from "./resultAction.mjs";
import {
  buildInviteTrackingContext,
  trackWebJoinEvent,
} from "./tracking";
import { useWebPhoneAuth } from "./useWebPhoneAuth";
import { resolveIdentityContinuation } from "./identityContinuation.mjs";

function smsFailureReason(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("too many") || message.includes("max")) return "max_attempts";
  if (message.includes("timeout") || message.includes("expired")) return "timeout";
  return "invalid_code";
}

function resultKindToOutcome(resultKind) {
  if (resultKind === "approved" || resultKind === "direct_join") return "confirmed";
  if (resultKind === "pending") return "pending";
  if (resultKind === "cant_go") return "cant_go";
  if (resultKind === "rejected") return "rejected";
  return "confirmed";
}

function stripInviteCodeFromText(text, inviteCode) {
  const rawText = String(text || "");
  const code = String(inviteCode || "").trim();
  if (!code) return rawText;

  const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return rawText
    .replace(new RegExp(`\\s*\\[${escapedCode}\\]\\s*`, "g"), " ")
    .replace(new RegExp(`\\s*\\(${escapedCode}\\)\\s*`, "g"), " ")
    .replace(new RegExp(`\\b(?:group|room)?\\s*code\\s*[:#-]?\\s*${escapedCode}\\b`, "gi"), "")
    .replace(new RegExp(`\\b${escapedCode}\\b`, "g"), "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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
  const [browserInfo, setBrowserInfo] = useState(null);
  const [storeUrl, setStoreUrl] = useState("");
  const [flowState, dispatch] = useReducer(inviteFlowReducer, undefined, createFlowState);
  const pageViewTrackedKeyRef = useRef("");
  const funnelStartedAtRef = useRef(null);
  const smsAttemptCountRef = useRef(0);
  const isReturningUserRef = useRef(false);
  const webPhoneAuth = useWebPhoneAuth();

  const isShareMode = Boolean(slug);
  const isRsvpModalOpen = flowState.view === FLOW_VIEW.EVENT &&
    flowState.eventCard === EVENT_CARD.RSVP;

  useEffect(() => {
    const detectedBrowser = detectInAppBrowser();
    setBrowserInfo(detectedBrowser);
    setStoreUrl(getAppStoreUrl());
  }, []);

  const showError = useCallback((message) => {
    setActionError(message || "Something went wrong. Please try again.");
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
  const displayInviteCode = String(inviteCode || invite?.invite_code || "").trim();
  const eventTitle = stripInviteCodeFromText(
    invite?.subject || "Wander event",
    displayInviteCode,
  ) || "Wander event";
  const eventDescription = stripInviteCodeFromText(
    invite?.description || "",
    displayInviteCode,
  );
  const hasQuestions = joinQuestions.length > 0;
  const verifiedUserId = verifiedClerkUserId || webPhoneAuth.clerkUserId;
  const hasRsvpFlow = canJoinOnWeb;
  const flowType = hasRsvpFlow ? "web_registration" : "app_handoff";

  const buildTrackingContext = useCallback(
    (overrides = {}) =>
      buildInviteTrackingContext({
        invite,
        webSession: overrides.webSession ?? webSession,
        slug,
        userId: overrides.userId ?? verifiedUserId,
      }),
    [invite, slug, verifiedUserId, webSession],
  );

  const trackingContext = useMemo(
    () => buildTrackingContext(),
    [buildTrackingContext],
  );

  const trackEvent = useCallback(
    (eventType, properties = {}, options = {}) =>
      trackWebJoinEvent(eventType, trackingContext, properties, options),
    [trackingContext],
  );

  const funnelDurationSec = useCallback(() => {
    const startedAt = funnelStartedAtRef.current || Date.now();
    return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  }, []);

  const trackRegistrationCompleted = useCallback(
    (completedSession, userId) => {
      const resultKind = resultStatusToResultKind(completedSession?.result_status);
      return trackWebJoinEvent(
        "web_registration_completed",
        buildTrackingContext({
          webSession: completedSession,
          userId,
        }),
        {
          rsvp_status: completedSession?.rsvp_status || flowState.rsvpIntent,
          has_questions: hasQuestions,
          has_rsvp: hasRsvpFlow,
          flow_type: flowType,
          outcome: resultKindToOutcome(resultKind),
          funnel_duration_sec: funnelDurationSec(),
        },
      );
    },
    [
      buildTrackingContext,
      flowState.rsvpIntent,
      flowType,
      funnelDurationSec,
      hasQuestions,
      hasRsvpFlow,
    ],
  );

  const openStoreFallback = useCallback(
    () => {
      window.location.assign(storeUrl || getAppStoreUrl());
    },
    [storeUrl],
  );

  useEffect(() => {
    if (!invite || loading) return;

    const trackKey = `${trackingContext.session_id}:${trackingContext.event_id}:web_detail_page_viewed`;
    if (pageViewTrackedKeyRef.current === trackKey) return;

    pageViewTrackedKeyRef.current = trackKey;
    funnelStartedAtRef.current = Date.now();
    trackEvent("web_detail_page_viewed", {
      has_questions: hasQuestions,
      has_rsvp: hasRsvpFlow,
      flow_type: flowType,
      attendee_count: attendeeCount,
    });
  }, [
    attendeeCount,
    hasQuestions,
    hasRsvpFlow,
    flowType,
    invite,
    loading,
    trackEvent,
    trackingContext.event_id,
    trackingContext.session_id,
  ]);

  const ensureWebSession = useCallback(async () => {
    if (webSession?.session_id) return webSession;
    if (!slug) return null;
    const payload = await createWebSession({ slug, inviteCode });
    setWebSession(payload.session);
    return payload.session;
  }, [inviteCode, slug, webSession]);

  const preserveInviteForStoreFallback = useCallback(() => {
    if (!slug || !displayInviteCode) return;
    copyToClipboard(
      buildInviteShareUrl({ slug, inviteCode: displayInviteCode }),
    );
  }, [displayInviteCode, slug]);

  const handleAppOpen = useCallback(
    (triggerPage = "detail", options = {}) => {
      const normalizedTriggerPage =
        typeof triggerPage === "string" ? triggerPage : "detail";
      if (browserInfo?.isInAppBrowser) {
        trackEvent(
          "web_in_app_browser_store_attempt",
          {
            trigger_page: normalizedTriggerPage,
            flow_type: flowType,
            has_rsvp: hasRsvpFlow,
            browser_app: browserInfo.appName,
          },
          { preferBeacon: true, keepalive: true },
        );
      }

      if (!options.skipTracking) {
        trackEvent(
          "web_download_tapped",
          {
            trigger_page: normalizedTriggerPage,
            flow_type: flowType,
            has_rsvp: hasRsvpFlow,
          },
          { preferBeacon: true, keepalive: true },
        );
      }

      preserveInviteForStoreFallback();
      triggerDeepLink({
        slug,
        inviteCode: displayInviteCode,
        onFallback: openStoreFallback,
      });
    },
    [
      browserInfo,
      displayInviteCode,
      flowType,
      hasRsvpFlow,
      openStoreFallback,
      preserveInviteForStoreFallback,
      slug,
      trackEvent,
    ],
  );

  const handleJoin = useCallback(async () => {
    if (pendingAction) return;
    setActionError("");
    if (!funnelStartedAtRef.current) funnelStartedAtRef.current = Date.now();
    trackEvent("web_join_tapped", {
      has_questions: hasQuestions,
      has_rsvp: hasRsvpFlow,
      flow_type: flowType,
      attendee_count: attendeeCount,
    });

    if (!isShareMode) {
      handleAppOpen();
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

    handleAppOpen("detail");
  }, [
    canJoinOnWeb,
    defaultAnswers,
    handleAppOpen,
    hasQuestions,
    hasRsvpFlow,
    flowType,
    ensureWebSession,
    attendeeCount,
    isShareMode,
    pendingAction,
    showError,
    trackEvent,
  ]);

  const handleResultAction = useCallback(() => {
    const triggerPage = resultTriggerPage(flowState.resultKind);
    trackEvent(
      "web_download_tapped",
      {
        trigger_page: triggerPage,
        flow_type: flowType,
        has_rsvp: hasRsvpFlow,
      },
      { preferBeacon: true, keepalive: true },
    );

    handleAppOpen(triggerPage, { skipTracking: true });
  }, [
    flowState.resultKind,
    flowType,
    handleAppOpen,
    hasRsvpFlow,
    trackEvent,
  ]);

  const completeFromBackend = useCallback(async (clerkUserId, displayName, sessionOverride = null) => {
    const session = sessionOverride || await ensureWebSession();
    if (!session?.session_id) {
      throw new Error("Missing web session");
    }

    if (!clerkUserId) {
      throw new Error("Missing verified Clerk user");
    }

    const requiresJoinQuestions =
      (flowState.rsvpIntent === "going" || flowState.rsvpIntent === "maybe") &&
      joinQuestions.length > 0;
    if (requiresJoinQuestions && !session.parent_expression_id) {
      throw new Error("Please answer the questions before joining.");
    }

    const payload = await completeWebSession({
      sessionId: session.session_id,
      clerkUserId,
      displayName: displayName ?? flowState.profile.name,
    });
    setWebSession(payload.session);
    return payload.session;
  }, [
    ensureWebSession,
    flowState.profile.name,
    flowState.rsvpIntent,
    joinQuestions.length,
  ]);

  const continueAfterProfile = useCallback(async (clerkUserId, displayName) => {
    const hasQuestions =
      (flowState.rsvpIntent === "going" || flowState.rsvpIntent === "maybe") &&
      joinQuestions.length > 0;

    if (hasQuestions) {
      dispatch({ type: "CONTINUE_TO_QUESTIONS" });
      return;
    }

    const completedSession = await completeFromBackend(clerkUserId, displayName);
    trackRegistrationCompleted(completedSession, clerkUserId);
    dispatch({
      type: "APPLY_BACKEND_RESULT",
      resultKind: resultStatusToResultKind(completedSession?.result_status),
    });
  }, [
    completeFromBackend,
    flowState.rsvpIntent,
    joinQuestions.length,
    trackRegistrationCompleted,
  ]);

  const continueFromIdentityStatus = useCallback(async (identityPayload, clerkUserId) => {
    setWebSession(identityPayload.session);
    const nextStep = resolveIdentityContinuation({
      session: identityPayload.session,
      identity: identityPayload.identity,
      rsvpIntent: flowState.rsvpIntent,
      questionCount: joinQuestions.length,
    });

    if (nextStep.name) {
      setJoinedAsName(nextStep.name);
      dispatch({ type: "UPDATE_PROFILE", field: "name", value: nextStep.name });
    }

    if (nextStep.type === "result") {
      trackRegistrationCompleted(identityPayload.session, clerkUserId);
      dispatch({
        type: "APPLY_BACKEND_RESULT",
        resultKind: nextStep.resultKind,
      });
      return;
    }

    if (nextStep.type === "name") {
      dispatch({
        type: "CONTINUE_TO_NAME",
        name: nextStep.name,
      });
      return;
    }

    if (nextStep.type === "questions") {
      dispatch({ type: "CONTINUE_TO_QUESTIONS" });
      return;
    }

    await continueAfterProfile(clerkUserId, nextStep.name);
  }, [
    continueAfterProfile,
    flowState.rsvpIntent,
    joinQuestions.length,
    trackRegistrationCompleted,
  ]);

  const handleContinueRsvp = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("rsvp");
    try {
      const session = await ensureWebSession();
      let updatedSession = session;
      if (session?.session_id) {
        const payload = await updateWebRsvp({
          sessionId: session.session_id,
          rsvpStatus: flowState.rsvpIntent,
        });
        setWebSession(payload.session);
        updatedSession = payload.session || session;
      }
      trackEvent("web_rsvp_selected", {
        rsvp_status: flowState.rsvpIntent,
        has_rsvp: hasRsvpFlow,
        flow_type: flowType,
      });

      if (webPhoneAuth.clerkUserId && updatedSession?.session_id) {
        setVerifiedClerkUserId(webPhoneAuth.clerkUserId);
        const identityPayload = await fetchWebIdentityStatus({
          sessionId: updatedSession.session_id,
          clerkUserId: webPhoneAuth.clerkUserId,
        });
        await continueFromIdentityStatus(identityPayload, webPhoneAuth.clerkUserId);
        return;
      }

      dispatch({ type: "CONTINUE_FROM_RSVP" });
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    continueFromIdentityStatus,
    ensureWebSession,
    flowState.rsvpIntent,
    flowType,
    hasRsvpFlow,
    pendingAction,
    showError,
    trackEvent,
    webPhoneAuth.clerkUserId,
  ]);

  const handleContinuePhone = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("phone");
    try {
      setVerifiedClerkUserId(null);
      setJoinedAsName("");
      const phoneAttempt = await webPhoneAuth.startPhoneVerification({
        profile: flowState.profile,
      });
      isReturningUserRef.current = phoneAttempt?.mode === "sign_in";
      smsAttemptCountRef.current = 0;
      trackEvent("web_phone_submitted", {
        rsvp_status: flowState.rsvpIntent,
        country_code: getPhoneCountry(flowState.profile.country).code,
        has_rsvp: hasRsvpFlow,
        flow_type: flowType,
      });
      setResendCooldown(60);
      dispatch({ type: "CONTINUE_FROM_PHONE" });
    } catch (err) {
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    flowState.profile,
    flowState.rsvpIntent,
    flowType,
    hasRsvpFlow,
    pendingAction,
    showError,
    trackEvent,
    webPhoneAuth,
  ]);

  const handleContinueOtp = useCallback(async () => {
    if (pendingAction) return;

    setActionError("");
    setPendingAction("otp");
    smsAttemptCountRef.current += 1;
    let codeVerified = false;
    try {
      const verified = await webPhoneAuth.verifyPhoneCode({
        code: flowState.otpCode,
      });
      codeVerified = true;
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
      trackWebJoinEvent(
        "web_sms_verified",
        buildTrackingContext({
          webSession: identityPayload.session || session,
          userId: verified.clerkUserId,
        }),
        {
          attempt_count: smsAttemptCountRef.current,
          is_returning_user: isReturningUserRef.current,
          has_rsvp: hasRsvpFlow,
          flow_type: flowType,
        },
      );
      await continueFromIdentityStatus(identityPayload, verified.clerkUserId);
    } catch (err) {
      if (!codeVerified) {
        trackEvent("web_sms_failed", {
          reason: smsFailureReason(err),
          attempt_count: smsAttemptCountRef.current,
          has_rsvp: hasRsvpFlow,
          flow_type: flowType,
        });
      }
      showError(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [
    continueFromIdentityStatus,
    ensureWebSession,
    flowState.otpCode,
    flowType,
    buildTrackingContext,
    hasRsvpFlow,
    pendingAction,
    showError,
    trackEvent,
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
        trackRegistrationCompleted(identityPayload.session, clerkUserId);
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
    trackRegistrationCompleted,
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
      trackWebJoinEvent(
        "web_question_submitted",
        buildTrackingContext({
          webSession: answersPayload.session || session,
          userId: clerkUserId,
        }),
        {
          question_count: joinQuestions.length,
          rsvp_status: flowState.rsvpIntent,
          has_rsvp: hasRsvpFlow,
          flow_type: flowType,
        },
      );
      const completed = await completeFromBackend(
        clerkUserId,
        undefined,
        answersPayload.session,
      );
      setWebSession(completed);
      trackRegistrationCompleted(completed, clerkUserId);
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
    flowState.rsvpIntent,
    flowType,
    hasRsvpFlow,
    joinQuestions,
    pendingAction,
    showError,
    buildTrackingContext,
    completeFromBackend,
    trackRegistrationCompleted,
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
              inviteCode={displayInviteCode}
              description={eventDescription}
              attendeeCount={attendeeCount}
              displayMembers={displayMembers}
              eventCard={flowState.eventCard}
              selectedRsvp={flowState.rsvpIntent}
              onSelectRsvp={(rsvpIntent) =>
                dispatch({ type: "SELECT_RSVP", rsvpIntent })
              }
              onContinueRsvp={handleContinueRsvp}
              onJoin={handleJoin}
              onStoreOpen={handleAppOpen}
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
                  trackEvent("web_sms_resend_tapped", {
                    rsvp_status: flowState.rsvpIntent,
                    has_rsvp: hasRsvpFlow,
                    flow_type: flowType,
                  });
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
