import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PageHeader from "../ui/PageHeader";

const FEEDBACK_KEY = "pocket-deck-feedback";

function getSavedFeedback() {
  const saved = localStorage.getItem(FEEDBACK_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Feedback() {
  const { user } = useContext(AuthContext);
  const [feedbackType, setFeedbackType] = useState("Bug");
  const [message, setMessage] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(getSavedFeedback);
  const [statusMessage, setStatusMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim()) {
      setStatusMessage("Write a quick note first.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      type: feedbackType,
      message: message.trim(),
      email: user?.email || "",
      createdAt: new Date().toISOString(),
    };

    const updatedFeedback = [newFeedback, ...savedFeedback];

    setSavedFeedback(updatedFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updatedFeedback));

    setMessage("");
    setStatusMessage("Feedback saved. Thank you.");
  }

  return (
    <div>
      <PageHeader
        label="POCKET DECK BETA"
        title="Feedback"
        description="Share bugs, ideas, polish notes, or anything that feels confusing."
      />

      <form className="feedback-card" onSubmit={handleSubmit}>
        <p className="page-label">PRIVATE BETA</p>
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

        <button className="primary-button" type="submit">
          Send Feedback
        </button>

        {statusMessage && <p className="auth-message">{statusMessage}</p>}
      </form>

      {savedFeedback.length > 0 && (
        <section className="feedback-list">
          <div className="section-header">
            <div>
              <h2>Saved Feedback</h2>
              <p>Feedback is saved locally for now.</p>
            </div>
          </div>

          {savedFeedback.map((item) => (
            <article className="feedback-item" key={item.id}>
              <span>{item.type}</span>
              <p>{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Feedback;