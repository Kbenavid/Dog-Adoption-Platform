import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [dogs, setDogs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch dogs the user registered
  const fetchDogs = async () => {
    try {
      const res = await api.get("/dogs/my-registered", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs(res.data.items || []);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load dogs");
    }
  };

  // Register a new dog
  const handleAddDog = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/dogs",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${res.data.name} registered!`);
      setName("");
      setDescription("");
      fetchDogs();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error registering dog");
    }
  };

  useEffect(() => {
    if (token) fetchDogs();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>🐾 Dashboard</h2>
      {message && <p>{message}</p>}

      {!token ? (
        <p>⚠️ Please log in to view your dogs.</p>
      ) : (
        <>
          <form onSubmit={handleAddDog}>
            <input
              type="text"
              placeholder="Dog name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            /><br/>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /><br/>
            <button type="submit">Add Dog</button>
          </form>

          <h3 style={{ marginTop: "2rem" }}>My Registered Dogs</h3>
          <ul>
            {dogs.map((dog) => (
              <li key={dog._id}>
                🐶 {dog.name} — {dog.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}