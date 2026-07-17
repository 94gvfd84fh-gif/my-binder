import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "../constants/storageKeys";

function getPrimaryBinder(card) {
  if (card.status === "Wishlist") {
    return "Wishlist";
  }

  return card.primaryBinder || card.binder || "Main Collection";
}

function readMissionState() {
  const savedMission =
    localStorage.getItem(STORAGE_KEYS.gettingStarted) ||
    localStorage.getItem(LEGACY_STORAGE_KEYS.gettingStarted);

  if (!savedMission) {
    return { started: false, completed: false };
  }

  try {
    return JSON.parse(savedMission);
  } catch {
    return { started: false, completed: false };
  }
}

function GettingStarted() {
  const { cards } = useContext(CardContext);
  const navigate = useNavigate();
  const [missionState, setMissionState] = useState(readMissionState);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const [feedbackComplete, setFeedbackComplete] = useState(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.gettingStartedFeedback) === "true" ||
      localStorage.getItem(LEGACY_STORAGE_KEYS.gettingStartedFeedback) === "true"
    );
  });

  useEffect(() => {
    function syncFeedbackState() {
      setFeedbackComplete(
        localStorage.getItem(STORAGE_KEYS.gettingStartedFeedback) === "true" ||
          localStorage.getItem(LEGACY_STORAGE_KEYS.gettingStartedFeedback) === "true"
      );
    }

    window.addEventListener("storage", syncFeedbackState);
    window.addEventListener("focus", syncFeedbackState);

    return () => {
      window.removeEventListener("storage", syncFeedbackState);
      window.removeEventListener("focus", syncFeedbackState);
    };
  }, []);

  const hasOwnedCard = cards.some((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const hasWishlistCard = cards.some((card) => {
    return getPrimaryBinder(card) === "Wishlist" || card.status === "Wishlist";
  });

  const hasTradeCard = cards.some((card) => {
    const extraBinders = Array.isArray(card.extraBinders)
      ? card.extraBinders
      : [];

    return card.status === "For Trade" || extraBinders.includes("Trade Binder");
  });

  const missionSteps = [
    {
      title: "Add one card you own",
      description: "Start with a card already in your collection.",
      complete: hasOwnedCard,
      actionLabel: "Add Card",
      actionTo: "/collection",
    },
    {
      title: "Add one wishlist card",
      description: "Track a card you are chasing.",
      complete: hasWishlistCard,
      actionLabel: "Open Collection",
      actionTo: "/collection",
    },
    {
      title: "Mark one card for trade",
      description: "Prepare your first trade signal.",
      complete: hasTradeCard,
      actionLabel: "Trade List",
      actionTo: "/trade-list",
    },
    {
      title: "Leave feedback",
      description: "Tell us what would make Beacon more useful.",
      complete: feedbackComplete,
      actionLabel: "Send Feedback",
      actionTo: "/feedback",
    },
  ];

  const completedSteps = missionSteps.filter((step) => step.complete).length;
  const missionComplete = completedSteps === missionSteps.length;
  const nextStep = missionSteps.find((step) => !step.complete);

  useEffect(() => {
    if (!missionComplete || missionState.completed) {
      return;
    }

    const completedState = {
      ...missionState,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.gettingStarted, JSON.stringify(completedState));
    setMissionState(completedState);
  }, [missionComplete, missionState]);

  if (dismissedThisSession || missionState.completed) {
    return null;
  }

  function saveMissionState(nextState) {
    localStorage.setItem(STORAGE_KEYS.gettingStarted, JSON.stringify(nextState));
    setMissionState(nextState);
  }

  function startMission() {
    saveMissionState({
      ...missionState,
      started: true,
      startedAt: missionState.startedAt || new Date().toISOString(),
    });

    navigate(nextStep?.actionTo || "/collection");
  }

  function hideMissionForNow() {
    setDismissedThisSession(true);
  }

  return (
    <section className="getting-started-card">
      <div className="getting-started-header">
        <div>
          <p className="page-label">GETTING STARTED</p>
          <h2>Set up Beacon in a few minutes</h2>
          <p>
            Add your first cards, organize what you're chasing, and turn Beacon
            into your collection hub.
          </p>
        </div>

        <div
          className="getting-started-progress"
          aria-label="Getting started progress"
        >
          <strong>{completedSteps}/4</strong>
          <span>complete</span>
        </div>
      </div>

      <div className="getting-started-steps">
        {missionSteps.map((step, index) => (
          <article
            className={
              step.complete
                ? "getting-started-step complete"
                : "getting-started-step"
            }
            key={step.title}
          >
            <div className="getting-started-step-number">
              {step.complete ? "✓" : index + 1}
            </div>

            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>

              {!step.complete && (
                <Link to={step.actionTo}>{step.actionLabel}</Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="getting-started-actions">
        <button className="primary-button" type="button" onClick={startMission}>
          {missionState.started ? "Continue Setup" : "Start Setup"}
        </button>

        <Link className="secondary-button" to="/feedback">
          Leave Feedback
        </Link>

        <button
          className="getting-started-skip"
          type="button"
          onClick={hideMissionForNow}
        >
          Hide for now
        </button>
      </div>
    </section>
  );
}

export default GettingStarted;
