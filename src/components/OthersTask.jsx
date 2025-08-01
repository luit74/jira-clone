import { useEffect, useState } from "react";
import TicketSidebar from "./TicketSidebar";
import "../styles/backlog.css"; // ✅ Reuse same styles as Backlog

const OthersTasks = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const userEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const all = saved.assignment || [];

    const active = all.filter((t) => t.status !== "DONE");
    setTickets(active);
  };

  const handleOpenSidebar = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    loadTickets(); // Refresh after changes
  };

  return (
    <div className="backlog-container">

      {tickets.length === 0 ? (
        <p>No tasks assigned to you by others.</p>
      ) : (
        <table className="ticket-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Work Type</th>
              <th>Status</th>
              <th>Assigned By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td
                  className="ticket-id-link"
                  onClick={() => handleOpenSidebar(ticket)}
                >
                  {ticket.id
                    ? `ES-${ticket.id.slice(0, 6).toUpperCase()}`
                    : "N/A"}
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
                <td>{ticket.creator}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTicket && (
        <div className="sidebar-overlay" onClick={handleCloseSidebar}>
          <TicketSidebar
            ticket={selectedTicket}
            onClose={handleCloseSidebar}
            onStatusChange={loadTickets}
          />
        </div>
      )}
    </div>
  );
};

export default OthersTasks;
