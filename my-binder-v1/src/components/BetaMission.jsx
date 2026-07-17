import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { STORAGE_KEYS } from "../constants/storageKeys";

function getPrimaryBinder(card) {
  if (card.status === "Wishlist") {
    return "Wishlist";
  }

  return card.primaryBinder || card.binder || "Main Collection";
}

function readMissionState() {
  const savedMission = localStorage.getItem(STORAGE_KEYS.betaMission);

  if (!savedMission) {
    return { started: false, skipped: false, completed: false };
  }

  try {
    return JSON.parse(savedMission);
  } catch {
    return { started: false, skipped: false, completed: false };
  }
}

function BetaMission() {
  const { cards } = useContext(CardContext);
  const navigate = useNavigate();
  const [missionState, setMissionState] = useState(readMissionState);
  const [feedbackComplete, setFeedbackComplete] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.betaFeedback) === "true";
  });

  useEffect(() => {
    function syncFeedbackState() {
      setFeedbackComplete(
        localStorage.getItem(STORAGE_KEYS.betaFeedback) === "true"
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

    localStorage.setItem(STORAGE_KEYS.betaMission, JSON.stringify(completedState));
    setMissionState(completedState);
  }, [missionComplete, missionState]);

  if (missionState.skipped || missionState.completed) {
    return null;
  }

  function saveMissionState(nextState) {
    localStorage.setItem(STORAGE_KEYS.betaMission, JSON.stringify(nextState));
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

  function skipMission() {
    saveMissionState({
      ...missionState,
      skipped: true,
      skippedAt: new Date().toISOString(),
    });
  }

  return (
    <section className="beta-mission-card">
      <div className="beta-mission-header">
        <div>
          <p className="page-label">GETTING STARTED</p>
          <h2>Set up Beacon in a few minutes</h2>
          <p>
            Add your first cards, organize what you're chasing, and turn Beacon
            into your collection hub.
          </p>
        </div>

        <div
          className="beta-mission-progress"
          aria-label="Getting started progress"
        >
          <strong>{completedSteps}/4</strong>
          <span>complete</span>
        </div>
      </div>

      <div className="beta-mission-steps">
        {missionSteps.map((step, index) => (
          <article
            className={
              step.complete
                ? "beta-mission-step complete"
                : "beta-mission-step"
            }
            key={step.title}
          >
            <div className="beta-mission-step-number">
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

      <div className="beta-mission-actions">
        <button className="primary-button" type="button" onClick={startMission}>
          {missionState.started ? "Continue Setup" : "Start Setup"}
        </button>

        <Link className="secondary-button" to="/feedback">
          Leave Feedback
        </Link>

        <button className="beta-mission-skip" type="button" onClick={skipMission}>
          Skip for now
        </button>
      </div>
    </section>
  );
}

export default BetaMission;
