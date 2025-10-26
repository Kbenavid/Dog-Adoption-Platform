import { useState } from "react";
import api from "../services/api";
import "../styles/RegisterDogPage.css";

export default function RegisterDogPage() {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("⚠️ Please log in to register a dog.");
      return;
    }

    // 🐾 Define the data object we’re sending
    const dogData = { name, description: `${breed}, ${age} years old` };

    try {
      const res = await api.post("/dogs", dogData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`🎉 ${res.data.name || name} has been added for adoption!`);
      setName("");
      setBreed("");
      setAge("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error registering dog");
    }
  };

  return (
    <div className="register-dog-page">
      <div className="card">
        <h2>🐶 Register a Dog for Adoption</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="dog-form">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Breed:
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </label>

          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>

          <button type="submit">Register 🐾</button>
        </form>
      </div>
    </div>
  );
}