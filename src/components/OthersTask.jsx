import { useEffect, useState } from "react";
import TicketSidebar from "./TicketSidebar";

const OthersTasks = ({ tickets: initialTickets }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loggedInUser = localStorage.getItem("loggedInUser")?.toLowerCase();
  const ticketKey = `tickets_${loggedInUser}`;

  const reloadTickets = () => {
    const saved = JSON.parse(localStorage.getItem(ticketKey)) || {};
    setTickets(saved.assignment || []);
  };

  const handleOpenSidebar = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    reloadTickets(); // Refresh just this component
  };

  if (!tickets || tickets.length === 0) {
    return <p>No tasks assigned to you by others.</p>;
  }

  return (
    <>
      <table className="ticket-table" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Date</th>
            <th>Assigned By</th>
            <th>Title</th>
            <th>Work Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={index}>
              <td
                className="ticket-id"
                style={{ cursor: "pointer", fontWeight: "bold", color: "blue" }}
                onClick={() => onSelect(ticket)}
              >
                {ticket.id ? `ES-${ticket.id.slice(0, 6).toUpperCase()}` : "N/A"}
              </td>
              <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td>{ticket.creator || "-"}</td>
              <td>{ticket.title}</td>
              <td>{ticket.workType}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
            onStatusChange={reloadTickets}
          />
        </div>
      )}
    </>
  );
};

export default OthersTasks;
