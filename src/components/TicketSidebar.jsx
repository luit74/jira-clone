// src/components/TicketSidebar.jsx
import { useEffect, useState } from "react";

const statusOptions = [
  "DONE",
  "IN DEVELOPMENT",
  "IN TESTING",
  "READY FOR AUDIT",
  "READY FOR PROD",
  "READY FOR TESTING",
  "IN AUDIT",
];

const TicketSidebar = ({ ticket, onClose }) => {
  const [status, setStatus] = useState(ticket?.status || "");

  useEffect(() => {
    setStatus(ticket.status);
  }, [ticket]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const userEmail = localStorage.getItem("loggedInUser");
    const ticketKey = `tickets_${userEmail}`;
    const storedTickets = JSON.parse(localStorage.getItem(ticketKey)) || [];

    const updatedTickets = storedTickets.map((t, i) =>
      i === ticket.index ? { ...t, status: newStatus } : t
    );

    localStorage.setItem(ticketKey, JSON.stringify(updatedTickets));

    if (newStatus === "DONE") {
      onClose();
    }
  };

  if (!ticket) return null;

  return (
    // Prevent click from propagating to the overlay
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "35rem",
        height: "100%",
        background: "#fff",
        borderLeft: "1px solid #ccc",
        padding: "1rem",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Ticket Details</h3>
        <button onClick={onClose}>&times;</button>
      </div>

      <p>
        <strong>Title:</strong> {ticket.title}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(ticket.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Description:</strong> {ticket.description}
      </p>
      <p>
        <strong>Work Type:</strong> {ticket.workType}
      </p>

      <div style={{ margin: "0.5rem 0" }}>
        <strong>Status:</strong>
        <select
          value={status}
          onChange={handleStatusChange}
          className="status-dropdown"
          style={{
            display: "block",
            marginTop: "0.5rem",
            padding: "0.4rem",
            width: "39%",
            background: "white",
            color: "black",
          }}
        >
          <option value="">Select Status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TicketSidebar;
