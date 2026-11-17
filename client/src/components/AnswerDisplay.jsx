function AnswerDisplay({ answer, sources }) {
  if (!answer) {
    return null;
  }

  return (
    <section className="answer-section">
      <h3>AI Answer</h3>

      <p className="answer-text">{answer}</p>

      <h4>Sources</h4>

      {sources.length === 0 ? (
        <p>No matching sources found.</p>
      ) : (
        sources.map((source, index) => (
          <article className="source-card" key={source.chunk_id}>
            <strong>
              {index + 1}. {source.title}
            </strong>

            <p>{source.content}</p>

            {source.url && (
              <a href={source.url} target="_blank" rel="noreferrer">
                View original source
              </a>
            )}
          </article>
        ))
      )}
    </section>
  );
}

export default AnswerDisplay;