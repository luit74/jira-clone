// src/components/AssignedTasks.jsx
import { useEffect, useState } from "react";
import "../styles/backlog.css";

const AssignedTasks = () => {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const userEmail = localStorage.getItem("loggedInUser");
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadAssignedTickets();
  }, []);

  const loadAssignedTickets = () => {
    const stored = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const assigned = Array.isArray(stored.assignee) ? stored.assignee : [];
    const withIndex = assigned.map((ticket, index) => ({ ...ticket, index }));
    setAssignedTickets(withIndex);
  };

  return (
    <div className="backlog-container">
      <h1>Assigned Tasks</h1>

      {assignedTickets.length === 0 ? (
        <p>No tasks assigned to others.</p>
      ) : (
        <table className="ticket-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Date</th>
              <th>Assigned To</th>
              <th>Work Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignedTickets.map((ticket, index) => (
              <tr key={index}>
                <td style={{ fontWeight: "bold", color: "blue" }}>
                  {ticket.id ? `ES-${ticket.id.slice(0, 6).toUpperCase()}` : "N/A"}
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>{ticket.assigned?.name || ticket.assignee?.email}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedTasks;
