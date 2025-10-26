import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">🐶 Adoptly</h1>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/alldogs">All Dogs</Link></li>
          {token && <li><Link to="/registerdog">Register Dog</Link></li>}
          {token && <li><Link to="/dashboard">Dashboard</Link></li>}
          {token ? (
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}