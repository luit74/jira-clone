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

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setTitle(ticket.title);
      setDescription(ticket.description);
      setWorkType(ticket.workType);
    }
  }, [ticket]);

  const updateTicketInStorage = (updatedFields) => {
    const userEmail = localStorage.getItem("loggedInUser");
    const ticketKey = `tickets_${userEmail}`;
    const stored = JSON.parse(localStorage.getItem(ticketKey)) || {};
    const { main = [], assignee = [] } = stored;

    const updateList = (list) =>
      list.map((t) =>
        t.id === ticket.id
          ? { ...t, ...updatedFields, updatedAt: new Date().toISOString() }
          : t
      );

    const updatedData = {
      main: updateList(main),
      assignee: updateList(assignee),
    };

    localStorage.setItem(ticketKey, JSON.stringify(updatedData));
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    updateTicketInStorage({ status: newStatus });

    if (onStatusChange) onStatusChange();
    if (newStatus === "DONE" && onClose) onClose();
  };

  const handleEditSave = () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      // Save
      updateTicketInStorage({
        title,
        description,
        workType,
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
              style={{ width: "100%", border: "1px solid #bfbfbf" }}
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
