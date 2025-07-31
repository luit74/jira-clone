// src/components/CompletedTask.jsx
import { useEffect, useState } from "react";
import "../styles/backlog.css"; // CSS should already handle the styling

const CompletedTask = () => {
  const [completedTickets, setCompletedTickets] = useState([]);
  const userEmail = localStorage.getItem("loggedInUser");
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadCompletedTickets();
  }, []);

  const loadCompletedTickets = () => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const mainTickets = Array.isArray(saved.main) ? saved.main : [];
    const doneTickets = mainTickets
      .map((ticket, index) => ({ ...ticket, index }))
      .filter((ticket) => ticket.status === "DONE");
    setCompletedTickets(doneTickets);
  };

  const handleDelete = (indexToDelete) => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const mainTickets = Array.isArray(saved.main) ? saved.main : [];

    const updatedMain = mainTickets.filter((_, i) => i !== indexToDelete);
    const updatedData = { ...saved, main: updatedMain };

    localStorage.setItem(ticketKey, JSON.stringify(updatedData));
    loadCompletedTickets(); // Refresh list
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
            {completedTickets.map((ticket, index) => (
              <tr key={index}>
                <td>
                  {ticket.id
                    ? `ES-${ticket.id.slice(0, 6).toUpperCase()}`
                    : "N/A"}
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  {ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button onClick={() => handleDelete(ticket.index)}>
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
