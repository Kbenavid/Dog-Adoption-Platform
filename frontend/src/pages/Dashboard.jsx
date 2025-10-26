import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">🐾 Dog Adoption Dashboard</h1>
      <p className="dashboard-subtext">Welcome! Choose an action below:</p>

      <div className="dashboard-buttons">
        <button className="dashboard-btn" onClick={() => navigate("/register-dog")}>
          ➕ Register New Dog
        </button>

        <button className="dashboard-btn" onClick={() => navigate("/my-dogs")}>
          📋 View My Registered Dogs
        </button>

        <button className="dashboard-btn" onClick={() => navigate("/my-adopted")}>
          ❤️ View My Adopted Dogs
        </button>

        <button className="dashboard-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}