import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import "../styles/MyDogsPage.css";

export default function MyDogsPage() {
  const [dogs, setDogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchMyDogs = async () => {
    try {
      const res = await api.get("/dogs/my-registered", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs(res.data.items || []);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load your registered dogs.");
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/dogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Dog removed successfully.");
      fetchMyDogs();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error removing dog");
    }
  };

  useEffect(() => {
    fetchMyDogs();
  }, []);

  return (
    <div className="page-container">
      <h2>🐕 My Registered Dogs</h2>
      {message && <p className="message">{message}</p>}

      {!token ? (
        <p className="login-warning">⚠️ Please log in to view your dogs.</p>
      ) : (
        <div className="card-grid">
          {dogs.length === 0 ? (
            <p>You haven’t registered any dogs yet.</p>
          ) : (
            dogs.map((dog) => (
              <Card
                key={dog._id}
                title={dog.name}
                description={`Status: ${dog.status}`}
                buttonLabel={
                  dog.status === "available" ? "Remove ❌" : "Adopted 🐾"
                }
                onButtonClick={
                  dog.status === "available"
                    ? () => handleRemove(dog._id)
                    : null
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}