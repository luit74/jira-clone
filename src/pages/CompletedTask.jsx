// src/components/CompletedTask.jsx
import { useEffect, useState } from "react";
import "../styles/backlog.css";

const CompletedTask = () => {
  const [completedTickets, setCompletedTickets] = useState([]);
  const userEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadCompletedTickets();
  }, []);

  const loadCompletedTickets = () => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const mainTickets = Array.isArray(saved.main) ? saved.main : [];

    // ✅ Only filter tickets from "main" where status === "DONE"
    const doneTickets = mainTickets.filter((ticket) => ticket.status === "DONE");

    setCompletedTickets(doneTickets);
  };

  const handleDelete = (ticketIdToDelete) => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const mainTickets = Array.isArray(saved.main) ? saved.main : [];

    // Remove the ticket with the matching ID
    const updatedMain = mainTickets.filter(ticket => ticket.id !== ticketIdToDelete);
    const updatedData = { ...saved, main: updatedMain };

    // Update user's tickets
    localStorage.setItem(ticketKey, JSON.stringify(updatedData));

    // ✅ Also remove from central all_tickets storage
    const allTickets = JSON.parse(localStorage.getItem("all_tickets")) || [];
    const updatedAllTickets = allTickets.filter(ticket => ticket.id !== ticketIdToDelete);
    localStorage.setItem("all_tickets", JSON.stringify(updatedAllTickets));

    loadCompletedTickets(); // Refresh
  };

  return (
    <div className="completed-task-container">
      <h1>Completed Tasks</h1>

      {completedTickets.length === 0 ? (
        <p>No completed tickets.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Work Type</th>
              <th>Status</th>
              <th>Creation Date</th>
              <th>Completion Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {completedTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{`ES-${ticket.id.slice(0, 6).toUpperCase()}`}</td>
                <td>{ticket.title}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : "-"}</td>
                <td>
                  <button onClick={() => handleDelete(ticket.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompletedTask;
