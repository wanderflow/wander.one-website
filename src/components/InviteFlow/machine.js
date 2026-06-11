import { DEFAULT_OTP_CODE } from "./constants";

export const FLOW_VIEW = {
  EVENT: "event",
  PHONE: "phone",
  OTP: "otp",
  NAME: "name",
  QUESTIONS: "questions",
  RESULT: "result",
};

export const EVENT_CARD = {
  JOIN: "join",
  RSVP: "rsvp",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  MAYBE: "maybe",
  CANT_GO: "cant_go",
};

export const RESULT_KIND = {
  DIRECT_JOIN: "direct_join",
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
  MAYBE: "maybe",
  CANT_GO: "cant_go",
};

export function createFlowState() {
  return {
    view: FLOW_VIEW.EVENT,
    eventCard: EVENT_CARD.JOIN,
    resultKind: null,
    rsvpIntent: "going",
    profile: {
      name: "",
      phoneDigits: "",
      country: "ca",
    },
    otpCode: DEFAULT_OTP_CODE,
    answers: {},
  };
}

export function buildDefaultAnswers(questions) {
  return (questions ?? []).reduce((accumulator, question) => {
    accumulator[question.id] =
      question.type === "choice" ? question.options?.[0] ?? "" : "";
    return accumulator;
  }, {});
}

export function canUseBrowserJoinFlow({ isShareMode, invite }) {
  return Boolean(isShareMode && invite?.time && invite?.location);
}

export function resolveEventCardFromResult(resultKind) {
  if (
    resultKind === RESULT_KIND.DIRECT_JOIN ||
    resultKind === RESULT_KIND.APPROVED
  ) {
    return EVENT_CARD.APPROVED;
  }

  if (resultKind === RESULT_KIND.PENDING) {
    return EVENT_CARD.PENDING;
  }

  if (resultKind === RESULT_KIND.REJECTED) {
    return EVENT_CARD.REJECTED;
  }

  if (resultKind === RESULT_KIND.MAYBE) {
    return EVENT_CARD.MAYBE;
  }

  if (resultKind === RESULT_KIND.CANT_GO) {
    return EVENT_CARD.CANT_GO;
  }

  return EVENT_CARD.JOIN;
}

export function inviteFlowReducer(state, action) {
  switch (action.type) {
    case "OPEN_RSVP":
      return {
        ...state,
        view: FLOW_VIEW.EVENT,
        eventCard: EVENT_CARD.RSVP,
        rsvpIntent: "going",
        profile: { name: "", phoneDigits: "", country: "ca" },
        otpCode: DEFAULT_OTP_CODE,
        answers: action.defaultAnswers,
        resultKind: null,
      };

    case "SELECT_RSVP":
      return {
        ...state,
        rsvpIntent: action.rsvpIntent,
      };

    case "CONTINUE_FROM_RSVP":
      return {
        ...state,
        view: FLOW_VIEW.PHONE,
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.field]: action.value,
        },
      };

    case "CONTINUE_FROM_PHONE":
      return {
        ...state,
        view: FLOW_VIEW.OTP,
      };

    case "CONTINUE_TO_NAME":
      return {
        ...state,
        view: FLOW_VIEW.NAME,
        profile: {
          ...state.profile,
          name: action.name ?? state.profile.name,
        },
      };

    case "CONTINUE_TO_QUESTIONS":
      return {
        ...state,
        view: FLOW_VIEW.QUESTIONS,
      };

    case "UPDATE_OTP":
      return {
        ...state,
        otpCode: action.otpCode,
      };

    case "UPDATE_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.value,
        },
      };

    case "COMPLETE_RESULT":
      return {
        ...state,
        view: FLOW_VIEW.EVENT,
        eventCard: resolveEventCardFromResult(state.resultKind),
      };

    case "APPLY_BACKEND_RESULT":
      return {
        ...state,
        view: FLOW_VIEW.RESULT,
        resultKind: action.resultKind,
      };

    case "RESTORE_EVENT_CARD":
      return {
        ...state,
        view: FLOW_VIEW.EVENT,
        eventCard: action.eventCard,
      };

    case "BACK": {
      if (state.view === FLOW_VIEW.PHONE) {
        return {
          ...state,
          view: FLOW_VIEW.EVENT,
          eventCard: EVENT_CARD.RSVP,
        };
      }

      if (state.view === FLOW_VIEW.OTP) {
        return {
          ...state,
          view: FLOW_VIEW.PHONE,
        };
      }

      if (state.view === FLOW_VIEW.NAME) {
        return {
          ...state,
          view: FLOW_VIEW.OTP,
        };
      }

      if (state.view === FLOW_VIEW.QUESTIONS) {
        return {
          ...state,
          view: FLOW_VIEW.OTP,
        };
      }

      return state;
    }

    case "RESET_TO_JOIN":
      return {
        ...state,
        view: FLOW_VIEW.EVENT,
        eventCard: EVENT_CARD.JOIN,
        resultKind: null,
      };

    default:
      return state;
  }
}
