import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TicketModal from "./TicketModal";
import "../styles/Navbar.css";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="sidebar">
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <button className="link-button" onClick={() => setShowModal(true)}>
            Create Ticket
          </button>
          <Link to="/backlog">Backlogs</Link>
        </div>
        <nav className="nav-links">
          
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      {showModal && <TicketModal onClose={() => setShowModal(false)} />}
    </>
  );
}
