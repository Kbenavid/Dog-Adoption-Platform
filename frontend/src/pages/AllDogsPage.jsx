import { useEffect, useState } from "react";
import api from "../services/api";

export default function AllDogsPage() {
  const [dogs, setDogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Load all available dogs
  const fetchDogs = async () => {
    try {
      const res = await api.get("/dogs/my-registered", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs(res.data.items || []);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to fetch dogs");
    }
  };

  const handleAdopt = async (id) => {
    try {
      const res = await api.post(
        `/dogs/${id}/adopt`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`🎉 You adopted ${res.data.name}!`);
      fetchDogs(); // Refresh list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error adopting dog");
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>🐾 Adopt a Dog</h2>
      {message && <p>{message}</p>}

      {!token ? (
        <p>⚠️ Please log in to adopt dogs.</p>
      ) : (
        <ul>
          {dogs.length === 0 ? (
            <p>No dogs available for adoption right now.</p>
          ) : (
            dogs.map((dog) => (
              <li key={dog._id} style={{ marginBottom: "1rem" }}>
                <strong>{dog.name}</strong> — {dog.status}
                {dog.status === "available" && (
                  <button
                    onClick={() => handleAdopt(dog._id)}
                    style={{
                      marginLeft: "1rem",
                      background: "#4caf50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Adopt ❤️
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}