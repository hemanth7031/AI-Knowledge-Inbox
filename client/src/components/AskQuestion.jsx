import { useState } from "react";
import { askQuestion } from "../services/api";
import AnswerDisplay from "./AnswerDisplay";

function AskQuestion() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAsk(event) {
    event.preventDefault();

    if (!question.trim()) {
      setMessage("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnswer("");
      setSources([]);

      const result = await askQuestion(question);

      setAnswer(result.answer);
      setSources(result.sources || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to get an answer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Ask Your Knowledge Inbox</h2>

      <form onSubmit={handleAsk}>
        <textarea
          rows="3"
          placeholder="Ask something about your saved content..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <AnswerDisplay answer={answer} sources={sources} />
    </section>
  );
}

export default AskQuestion;