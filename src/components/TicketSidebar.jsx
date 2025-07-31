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

const TicketSidebar = ({ ticket, onClose, onDelete }) => {
  const [status, setStatus] = useState(ticket?.status || "");

  useEffect(() => {
    setStatus(ticket.status);
  }, [ticket]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    let storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];

    if (newStatus === "DONE") {
      // Delete ticket
      const updatedTickets = storedTickets.filter((_, i) => i !== ticket.index);
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      onDelete(); // triggers state update and closes sidebar
    } else {
      // Just update status
      const updatedTickets = storedTickets.map((t, i) =>
        i === ticket.index ? { ...t, status: newStatus } : t
      );
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
    }
  };

  if (!ticket) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "30rem",
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

      <p><strong>Title:</strong> {ticket.title}</p>
      <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Work Type:</strong> {ticket.workType}</p>

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
