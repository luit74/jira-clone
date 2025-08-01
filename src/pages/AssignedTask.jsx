// src/pages/AssignedTasks.jsx
import { useEffect, useState } from "react";

import "../styles/assignedTasks.css";
import OthersTasks from "../components/OthersTask";

const AssignedTasks = () => {
  const [activeTab, setActiveTab] = useState("my");
  const [myAssignedTickets, setMyAssignedTickets] = useState([]);
  const [othersAssignedToMe, setOthersAssignedToMe] = useState([]);

  const userEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
  const ticketKey = `tickets_${userEmail}`;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const stored = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const assigned = Array.isArray(stored.assignee) ? stored.assignee : [];
    const main = Array.isArray(stored.main) ? stored.main : [];

    const myTasks = assigned.map((ticket, index) => ({
      ...ticket,
      index,
    }));

    const assignedToMe = main
      .filter((ticket) => ticket.assignee === userEmail)
      .map((ticket, index) => ({
        ...ticket,
        index,
      }));

    setMyAssignedTickets(myTasks);
    setOthersAssignedToMe(assignedToMe);
  };

  const renderMyTasksTable = (tickets) => (
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
        {tickets.map((ticket, index) => (
          <tr key={index}>
            <td className="ticket-id">
              {ticket.id ? `ES-${ticket.id.slice(0, 6).toUpperCase()}` : "N/A"}
            </td>
            <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>{ticket.assigned?.name || ticket.assignee?.email || ticket.assignee || "-"}</td>
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
          My Tasks
        </button>
        <button
          className={activeTab === "others" ? "tab active" : "tab"}
          onClick={() => setActiveTab("others")}
        >
          Others' Tasks
        </button>
      </div>

      {activeTab === "my" ? (
        myAssignedTickets.length === 0 ? (
          <p>No tasks assigned to others.</p>
        ) : (
          renderMyTasksTable(myAssignedTickets)
        )
      ) : (
        <OthersTasks tickets={othersAssignedToMe} />
      )}
    </div>
  );
};

export default AssignedTasks;
