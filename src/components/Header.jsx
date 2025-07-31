import "../styles/header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TicketModal from "./TicketModal";
import {
  Bell,
  HelpCircle,
  Settings,
  Grid,
  ChevronLeft,
  Search,
} from "lucide-react";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="main-header">
        <div style={{ margin: ".4rem 3rem" }}>
          <img width={100} src="/jira.webp" alt="Logo" />
        </div>

        <div className="search-box">
          <input style={{ width: "49rem" }} type="text" placeholder="Search..." />
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + Create
          </button>
        </div>

        <div>
          <button style={{ margin: ".4rem 3rem" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showModal && <TicketModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Header;
