// src/pages/AssignedTasks.jsx
import { useEffect, useState } from "react";
import "../styles/assignedTasks.css";
import OthersTasks from "../components/OthersTask";
import TicketSidebar from "../components/TicketSidebar"; // ✅ Add this

const AssignedTasks = () => {
  const [activeTab, setActiveTab] = useState("my");
  const [myAssignedTickets, setMyAssignedTickets] = useState([]);
  const [othersAssignedToMe, setOthersAssignedToMe] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // ✅ Sidebar state

  const userEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const stored = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const assigned = Array.isArray(stored.assignee) ? stored.assignee : [];
    const assignment = Array.isArray(stored.assignment) ? stored.assignment : [];

    const myTasks = assigned.map((ticket, index) => ({
      ...ticket,
      index,
    }));

    const assignedToMe = assignment.map((ticket, index) => ({
      ...ticket,
      index,
    }));

    setMyAssignedTickets(myTasks);
    setOthersAssignedToMe(assignedToMe);
  };

  const handleOpenSidebar = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    loadTickets(); // Refresh view
  };

  const renderMyTasksTable = (tickets) => (
    <table className="ticket-table" border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Date</th>
          <th>Assigned To</th>
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
              onClick={() => handleOpenSidebar(ticket)}
            >
              {ticket.id ? `ES-${ticket.id.slice(0, 6).toUpperCase()}` : "N/A"}
            </td>
            <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>{ticket.assignee || "-"}</td>
            <td>{ticket.title}</td>
            <td>{ticket.workType}</td>
            <td>{ticket.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="assigned-tasks-container">
      <h1>Assigned Tasks</h1>

      <div style={{ margin: "2rem" }} className="tab-buttons">
        <button
          className={activeTab === "my" ? "tab active" : "tab"}
          onClick={() => setActiveTab("my")}
        >
          By me
        </button>
        <button
          className={activeTab === "others" ? "tab active" : "tab"}
          onClick={() => setActiveTab("others")}
        >
          For me
        </button>
      </div>

      {activeTab === "my" ? (
        myAssignedTickets.length === 0 ? (
          <p>No tasks assigned to others.</p>
        ) : (
          renderMyTasksTable(myAssignedTickets)
        )
      ) : (
        <OthersTasks tickets={othersAssignedToMe} onSelect={handleOpenSidebar} />
      )}

      {/* ✅ Sidebar overlay */}
      {selectedTicket && (
        <div
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
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

export default AssignedTasks;
