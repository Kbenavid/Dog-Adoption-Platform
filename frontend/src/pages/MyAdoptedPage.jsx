import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import "../styles/MyAdoptedPage.css";

export default function MyAdoptedPage() {
  const [dogs, setDogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchAdoptedDogs = async () => {
    try {
      const res = await api.get("/dogs/my-adopted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs(res.data.items || []);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load adopted dogs.");
    }
  };

  useEffect(() => {
    fetchAdoptedDogs();
  }, []);

  return (
    <div className="page-container">
      <h2>🐾 My Adopted Dogs</h2>
      {message && <p className="message">{message}</p>}

      {!token ? (
        <p className="login-warning">⚠️ Please log in to view adopted dogs.</p>
      ) : (
        <div className="card-grid">
          {dogs.length === 0 ? (
            <p>You haven’t adopted any dogs yet.</p>
          ) : (
            dogs.map((dog) => (
              <Card
                key={dog._id}
                title={dog.name}
                description={`Adopted on: ${new Date(
                  dog.adoptedAt
                ).toLocaleDateString()}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}