import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getFeedback, saveFeedback } from "../services/feedbackService";
import PageHeader from "../ui/PageHeader";
import { STORAGE_KEYS } from "../constants/storageKeys";

function Feedback() {
  const { user } = useContext(AuthContext);
  const [feedbackType, setFeedbackType] = useState("Bug");
  const [message, setMessage] = useState("");
  const [savedFeedback, setSavedFeedback] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadFeedback() {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setStatusMessage("");

      try {
        const feedback = await getFeedback(user.id);
        setSavedFeedback(feedback);
      } catch (error) {
        setStatusMessage(error.message);
      }

      setIsLoading(false);
    }

    loadFeedback();
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setStatusMessage("Sign in before sending feedback.");
      return;
    }

    if (!message.trim()) {
      setStatusMessage("Write a quick note first.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      const newFeedback = await saveFeedback({
        userId: user.id,
        email: user.email,
        type: feedbackType,
        message: message.trim(),
      });

      setSavedFeedback((currentFeedback) => [
        newFeedback,
        ...currentFeedback,
      ]);

      localStorage.setItem(STORAGE_KEYS.betaFeedback, "true");
      setMessage("");
      setStatusMessage("Feedback sent. Thank you.");
    } catch (error) {
      setStatusMessage(error.message);
    }

    setIsSaving(false);
  }

  return (
    <div>
      <PageHeader
        label="BEACON COLLECT"
        title="Feedback"
        description="Share bugs, ideas, polish notes, or anything that feels confusing."
      />

      <form className="feedback-card" onSubmit={handleSubmit}>
        <p className="page-label">FEEDBACK</p>
        <h2>What should we improve?</h2>

        <select
          value={feedbackType}
          onChange={(event) => setFeedbackType(event.target.value)}
        >
          <option>Bug</option>
          <option>Idea</option>
          <option>Design</option>
          <option>Confusing</option>
          <option>Other</option>
        </select>

        <textarea
          placeholder="Example: Adding a card was easy, but I could not find where to edit binders..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        ></textarea>

        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? "Sending..." : "Send Feedback"}
        </button>

        {statusMessage && <p className="auth-message">{statusMessage}</p>}
      </form>

      <section className="feedback-list">
        <div className="section-header">
          <div>
            <h2>Submitted Feedback</h2>
            <p>Your feedback is saved to Beacon Collect.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state-card">
            <h2>Loading feedback</h2>
            <p>Getting your saved feedback from Beacon Collect.</p>
          </div>
        ) : savedFeedback.length > 0 ? (
          savedFeedback.map((item) => (
            <article className="feedback-item" key={item.id}>
              <span>{item.type}</span>
              <p>{item.message}</p>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </article>
          ))
        ) : (
          <div className="empty-state-card">
            <h2>No feedback yet</h2>
            <p>Send your first note when something feels confusing or worth improving.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Feedback;