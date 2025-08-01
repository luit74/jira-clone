import { useEffect, useState } from "react";
import "../styles/ticketsidebar.css";

const statusOptions = [
  "DONE",
  "IN DEVELOPMENT",
  "IN TESTING",
  "READY FOR AUDIT",
  "READY FOR PROD",
  "READY FOR TESTING",
  "IN AUDIT",
];

const workTypeOptions = ["Bug", "Fix", "Improvement", "Task"];

const TicketSidebar = ({ ticket, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(ticket?.status || "");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(ticket?.title || "");
  const [description, setDescription] = useState(ticket?.description || "");
  const [workType, setWorkType] = useState(ticket?.workType || "");
  const [assignee, setAssignee] = useState(ticket?.assignee || "");

  const loggedInUser = localStorage.getItem("loggedInUser")?.toLowerCase();

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setTitle(ticket.title);
      setDescription(ticket.description);
      setWorkType(ticket.workType);
      setAssignee(ticket.assignee);
    }
  }, [ticket]);

  //   const updateTicketEverywhere = (updatedFields) => {
  //     const updatedTicket = {
  //       ...ticket,
  //       ...updatedFields,
  //       updatedAt: new Date().toISOString(),
  //     };

  //     const creatorKey = `tickets_${ticket.creator}`;
  //     const creatorData = JSON.parse(localStorage.getItem(creatorKey)) || {
  //       main: [],
  //       assignee: [],
  //     };

  //     const listName = ticket.creator === loggedInUser ? "main" : "assignee";

  //     creatorData[listName] = creatorData[listName].map((t) =>
  //       t.id === ticket.id ? updatedTicket : t
  //     );
  //     localStorage.setItem(creatorKey, JSON.stringify(creatorData));

  //     // Only proceed if assignee is actually changed
  //     if (ticket.assignee !== assignee && assignee) {
  //       // Remove from old assignee's assignment list
  //       if (ticket.assignee) {
  //         const oldAssigneeKey = `tickets_${ticket.assignee}`;
  //         const oldAssigneeData = JSON.parse(
  //           localStorage.getItem(oldAssigneeKey)
  //         ) || {
  //           assignment: [],
  //         };
  //         oldAssigneeData.assignment = (oldAssigneeData.assignment || []).filter(
  //           (t) => t.id !== ticket.id
  //         );
  //         localStorage.setItem(oldAssigneeKey, JSON.stringify(oldAssigneeData));
  //       }

  //       // Add to new assignee's assignment list
  //       const newAssigneeKey = `tickets_${assignee}`;
  //       const newAssigneeData = JSON.parse(
  //         localStorage.getItem(newAssigneeKey)
  //       ) || {
  //         assignment: [],
  //       };

  //       const ticketForAssignee = {
  //         ...updatedTicket,
  //         assignee,
  //         creator: ticket.creator,
  //       };

  //       newAssigneeData.assignment = [
  //         ...(newAssigneeData.assignment || []),
  //         ticketForAssignee,
  //       ];

  //       localStorage.setItem(newAssigneeKey, JSON.stringify(newAssigneeData));
  //     }
  //   };

  //   const handleStatusChange = (e) => {
  //     const newStatus = e.target.value;
  //     setStatus(newStatus);
  //     updateTicketEverywhere({ status: newStatus });
  //     if (onStatusChange) onStatusChange();
  //     if (newStatus === "DONE" && onClose) onClose();
  //   };

  const updateTicketEverywhere = (updatedFields) => {
    const updatedTicket = {
      ...ticket,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    // 1. ✅ Update central all_tickets
    const allTickets = JSON.parse(localStorage.getItem("all_tickets")) || [];
    const updatedAllTickets = allTickets.map((t) =>
      t.id === ticket.id ? updatedTicket : t
    );
    localStorage.setItem("all_tickets", JSON.stringify(updatedAllTickets));

    // 2. ✅ Update in assignee's own assignment list
    if (ticket.assignee) {
      const assigneeKey = `tickets_${ticket.assignee}`;
      const assigneeData = JSON.parse(localStorage.getItem(assigneeKey)) || {
        assignment: [],
      };

      assigneeData.assignment = (assigneeData.assignment || []).map((t) =>
        t.id === ticket.id ? updatedTicket : t
      );

      localStorage.setItem(assigneeKey, JSON.stringify(assigneeData));
    }

    // 3. ✅ Update in creator's view under 'assignee' array
    if (ticket.creator) {
      const creatorKey = `tickets_${ticket.creator}`;
      const creatorData = JSON.parse(localStorage.getItem(creatorKey)) || {
        main: [],
        assignee: [],
      };

      creatorData.assignee = (creatorData.assignee || []).map((t) =>
        t.id === ticket.id ? updatedTicket : t
      );

      localStorage.setItem(creatorKey, JSON.stringify(creatorData));
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const ticketKey = `tickets_${ticket.creator}`;
    const savedData = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const mainTickets = savedData.main || [];

    const updatedMain = mainTickets.map((t) =>
      t.id === ticket.id
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    );

    localStorage.setItem(
      ticketKey,
      JSON.stringify({ ...savedData, main: updatedMain })
    );

    // Also update in global all_tickets
    const allTickets = JSON.parse(localStorage.getItem("all_tickets")) || [];
    const updatedAll = allTickets.map((t) =>
      t.id === ticket.id
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    );
    localStorage.setItem("all_tickets", JSON.stringify(updatedAll));

    if (onStatusChange) onStatusChange();
    if (newStatus === "DONE" && onClose) onClose();
  };

  const handleEditSave = () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      // Save edits
      updateTicketEverywhere({
        title,
        description,
        workType,
        assignee,
      });

      setEditMode(false);
      if (onStatusChange) onStatusChange();
      if (onClose) onClose();
    }
  };

  if (!ticket) return null;

  return (
    <div className="ticket-sidebar" onClick={(e) => e.stopPropagation()}>
      <div className="ticket-sidebar-header">
        <h3>🎟️ Ticket Details</h3>
        <button className="edit-btn" onClick={handleEditSave}>
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="ticket-info">
        <p>
          <strong>Title:</strong>{" "}
          {editMode ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #bbb9b9",
              }}
            />
          ) : (
            title
          )}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {editMode ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          ) : (
            description
          )}
        </p>

        <p>
          <strong>Work Type:</strong>{" "}
          {editMode ? (
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="dropdown-field"
            >
              <option value="">Select Work Type</option>
              {workTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          ) : (
            workType
          )}
        </p>

        <p>
          <strong>Assignee:</strong>{" "}
          {editMode ? (
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value.toLowerCase())}
              className="input-field"
              placeholder="Enter assignee email"
            />
          ) : (
            assignee
          )}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(ticket.createdAt).toLocaleString()}
        </p>

        {ticket.updatedAt && (
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(ticket.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="ticket-status">
        <label htmlFor="status-select">
          <strong>Status:</strong>
        </label>
        <select
          id="status-select"
          value={status}
          onChange={handleStatusChange}
          className="status-dropdown"
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
