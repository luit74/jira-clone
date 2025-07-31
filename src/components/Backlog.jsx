import { useEffect, useState } from "react";
import TicketSidebar from "./TicketSidebar";
import "../styles/backlog.css";

const Backlog = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const userEmail = localStorage.getItem("user");
  const ticketKey = `tickets_${userEmail}`;
  
  console.log('userEmail:', userEmail)
  // console.log("ticketKey" , ticketKey);

  

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const savedTickets = JSON.parse(localStorage.getItem(ticketKey)) || [];
    const ticketsWithIndex = savedTickets.map((ticket, index) => ({ ...ticket, index }));
    setTickets(ticketsWithIndex);
  };

  const handleOpenSidebar = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    loadTickets(); 
  };

  const handleDelete = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.filter((_, i) => i !== selectedTicket.index);
      localStorage.setItem(ticketKey , JSON.stringify(updatedTickets));
      setSelectedTicket(null);
      loadTickets();
    }
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
              <th>Date</th>
              <th>Title</th>
              <th>Work Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>{ticket.title}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.status}</td>
                <td>
                  <button onClick={() => handleOpenSidebar(ticket)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTicket && (
        <TicketSidebar
          ticket={selectedTicket}
          onClose={handleCloseSidebar}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Backlog;
