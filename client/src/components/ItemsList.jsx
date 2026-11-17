function ItemsList({ items }) {
  return (
    <section className="panel">
      <h2>Saved Knowledge</h2>

      {items.length === 0 ? (
        <p>No content saved yet.</p>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <article className="item-card" key={item.id}>
              <h3>{item.title}</h3>

              <span className="item-type">{item.type}</span>

              <p>{item.preview}</p>

              {item.url && (
                <a href={item.url} target="_blank" rel="noreferrer">
                  Open source
                </a>
              )}

              <small>
                {new Date(item.created_at).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemsList;