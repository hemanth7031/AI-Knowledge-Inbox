import { useState } from "react";
import { ingestContent } from "../services/api";

function AddContent({ onItemAdded }) {
  const [type, setType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    if (type === "text" && !content.trim()) {
      setMessage("Please enter some content.");
      return;
    }

    if (type === "url" && !url.trim()) {
      setMessage("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);

      await ingestContent({
        type,
        title,
        content: type === "text" ? content : "",
        url: type === "url" ? url : "",
      });
      console.log(content,title,url,"update data....")

      setTitle("");
      setContent("");
      setUrl("");
      setMessage("Content saved successfully!");

      if (onItemAdded) {
        await onItemAdded();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to save content."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Add Knowledge</h2>

      <form onSubmit={handleSubmit}>
        <label>Content Type</label>

        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="text">Text Note</option>
          <option value="url">Website URL</option>
        </select>

        <label>Title</label>

        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        {type === "text" ? (
          <>
            <label>Content</label>
            <textarea
              rows="5"
              placeholder="Enter your notes here..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </>
        ) : (
          <>
            <label>Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Content"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </section>
  );
}

export default AddContent;