import { useEffect, useState } from "react";
import AddContent from "./components/AddContent";
import ItemsList from "./components/ItemsList";
import AskQuestion from "./components/AskQuestion";
import { getItems } from "./services/api";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      setError("");
      const data = await getItems();
      console.log(data,"Item..")
      setItems(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load saved content."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Knowledge Inbox</h1>
        <p>Save knowledge. Ask questions. Get AI-powered answers.</p>
      </header>

      <main className="main-content">
        <AddContent onItemAdded={loadItems} />

        <AskQuestion />

        <section>
          {loading ? (
            <p>Loading saved content...</p>
          ) : error ? (
            <p className="message">{error}</p>
          ) : (
            <ItemsList items={items} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;