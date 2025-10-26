import "./styles/global.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AllDogsPage from "./pages/AllDogsPage";
import RegisterDogPage from "./pages/RegisterDogPage";
import MyDogsPage from "./pages/MyDogsPage";
import MyAdoptedPage from "./pages/MyAdoptedPage";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1>🐾 Dog Adoption Platform</h1>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/all-dogs">All Dogs</Link></li>
          <li><Link to="/register-dog">Register Dog</Link></li>
          <li><Link to="/my-dogs">My Dogs</Link></li>
          <li><Link to="/my-adopted">My Adopted</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      <div className="page-container">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-dogs" element={<AllDogsPage />} />
          <Route path="/register-dog" element={<RegisterDogPage />} />
          <Route path="/my-dogs" element={<MyDogsPage />} />
          <Route path="/my-adopted" element={<MyAdoptedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;