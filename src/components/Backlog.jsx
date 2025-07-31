import { useEffect, useState } from "react";
import TicketSidebar from "./TicketSidebar";
import "../styles/backlog.css";

const Backlog = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const userEmail = localStorage.getItem("loggedInUser");
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const savedData = JSON.parse(localStorage.getItem(ticketKey)) || [];

    // If the structure is an object with `.main`, fallback to that
    const myTickets = Array.isArray(savedData) ? savedData : savedData.main || [];

    // Filter out DONE tickets
    const filtered = myTickets.filter((ticket) => ticket.status !== "DONE");

    const ticketsWithIndex = filtered.map((ticket, index) => ({
      ...ticket,
      index,
    }));

    setTickets(ticketsWithIndex);
  };

  const handleOpenSidebar = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    loadTickets(); // Refresh after closing sidebar (e.g., after editing)
  };

  return (
    <div className="backlog-container">
      <h1>Backlog</h1>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="ticket-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Work Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td
                  onClick={() => handleOpenSidebar(ticket)}
                  style={{
                    color: "blue",
                    fontWeight: "800",
                    cursor: "pointer",
                    fontFamily: "sans-serif",
                  }}
                >
                  {ticket.id
                    ? `ES-${ticket.id.slice(0, 6).toUpperCase()}`
                    : "N/A"}
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTicket && (
        <div
          onClick={handleCloseSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
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

export default Backlog;
