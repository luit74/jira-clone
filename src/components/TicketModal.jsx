import { useEffect, useState } from "react";
import "../styles/ticketmodal.css";

export default function TicketModal({ onClose }) {
  const [users, setUsers] = useState([]);

  const workTypeOptions = ["Bug", "Fix", "Improvement", "Task"];
  const statusOptions = [
    "IN DEVELOPMENT",
    "IN TESTING",
    "READY FOR AUDIT",
    "READY FOR PROD",
    "READY FOR TESTING",
    "IN AUDIT",
  ];

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const userList = [];

    allKeys.forEach((key) => {
      if (
        key !== "loggedInUser" &&
        key !== "user" &&
        !key.startsWith("tickets_") &&
        !key.startsWith("all_tickets")
      ) {
        try {
          const userData = JSON.parse(localStorage.getItem(key));
          if (userData && userData.email) {
            userList.push(userData);
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage:", key, error);
        }
      }
    });

    setUsers(userList);
  }, []);

  const handleSubmitTicket = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const workType = e.target.workType.value;
    const status = e.target.status.value;
    const assigneeEmail = e.target.assignee.value;

    const creatorEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
    const assigneeUser =
      assigneeEmail === "self"
        ? { email: creatorEmail, firstName: "You" }
        : users.find(
            (user) => user?.email?.toLowerCase() === assigneeEmail.toLowerCase()
          );

    if (!assigneeUser || !assigneeUser.email) {
      alert("Invalid assignee selected.");
      return;
    }

    const newTicket = {
      id: crypto.randomUUID(),
      title,
      description,
      workType,
      status,
      creator: creatorEmail,
      assignee: assigneeUser.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ✅ Centralized store
    const allTickets = JSON.parse(localStorage.getItem("all_tickets")) || [];
    allTickets.push(newTicket);
    localStorage.setItem("all_tickets", JSON.stringify(allTickets));

    // ✅ Creator's storage
    const creatorKey = `tickets_${creatorEmail}`;
    const creatorData = JSON.parse(localStorage.getItem(creatorKey)) || {};
    const main = creatorData.main || [];
    const assignee = creatorData.assignee || [];

    if (creatorEmail === assigneeUser.email) {
      // Assigned to self → goes in main
      localStorage.setItem(
        creatorKey,
        JSON.stringify({ ...creatorData, main: [...main, newTicket] })
      );
    } else {
      // Assigned to others → goes in assignee
      localStorage.setItem(
        creatorKey,
        JSON.stringify({ ...creatorData, assignee: [...assignee, newTicket] })
      );

      // ✅ Assignee's storage → goes in assignment
      const assigneeKey = `tickets_${assigneeUser.email.toLowerCase()}`;
      const assigneeData =
        JSON.parse(localStorage.getItem(assigneeKey)) || {};
      const assignment = assigneeData.assignment || [];

      localStorage.setItem(
        assigneeKey,
        JSON.stringify({
          ...assigneeData,
          assignment: [...assignment, newTicket],
        })
      );
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Ticket</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmitTicket} className="ticket-form">
          <input name="title" placeholder="Title" required />
          <textarea
            style={{ width: "100%" }}
            name="description"
            placeholder="Description"
            required
          />

          <select name="workType" required>
            <option value="">Select Work Type</option>
            {workTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select name="status" required>
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select name="assignee" required>
            <option value="">Select Assignee</option>
            <option value="self">Assign to Me</option>
            {users.map((user) => (
              <option key={user.email} value={user.email}>
                {user.firstName}
              </option>
            ))}
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
