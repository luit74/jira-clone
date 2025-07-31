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
        !key.startsWith("tickets_")
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

//   const handleSubmitTicket = (e) => {
//     e.preventDefault();

//     const title = e.target.title.value;
//     const description = e.target.description.value;
//     const workType = e.target.workType.value;
//     const status = e.target.status.value;
//     const assigneeEmail = e.target.assignee.value;

//     const creatorEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
//     const creatorKey = `tickets_${creatorEmail}`;

//     const assigneeUser =
//       assigneeEmail === "self"
//         ? { email: creatorEmail, firstName: "You" }
//         : users.find((user) => user.email === assigneeEmail);

//     const newTicket = {
//       id: crypto.randomUUID(),
//       title,
//       description,
//       workType,
//       status,
//       assignee: {
//         email: assigneeUser.email,
//         name: assigneeUser.firstName,
//       },
//       createdAt: new Date().toISOString(),
//     };

//     if (assigneeEmail === "self") {
//       // Save into my tickets (backlog)
//       const existingMyTickets =
//         JSON.parse(localStorage.getItem(creatorKey)) || [];
//       localStorage.setItem(
//         creatorKey,
//         JSON.stringify([...existingMyTickets, newTicket])
//       );
//       console.log("Ticket saved in your backlog");
//     } else {
//       // Save only in assignee's ticket object, under `assignee` key
//       const assigneeKey = `tickets_${assigneeEmail.toLowerCase()}`;
//       const existingData = JSON.parse(localStorage.getItem(assigneeKey)) || {};
//       const updatedAssigneeTickets = Array.isArray(existingData.assignee)
//         ? [...existingData.assignee, newTicket]
//         : [newTicket];

//       const updatedStorage = {
//         ...existingData,
//         assignee: updatedAssigneeTickets,
//       };

//       localStorage.setItem(assigneeKey, JSON.stringify(updatedStorage));
//       console.log("Ticket saved under assignee's nested object");
//     }

//     onClose();
//   };

    const handleSubmitTicket = (e) => {
  e.preventDefault();

  const title = e.target.title.value;
  const description = e.target.description.value;
  const workType = e.target.workType.value;
  const status = e.target.status.value;
  const assigneeEmail = e.target.assignee.value;

  const creatorEmail = localStorage.getItem("loggedInUser")?.toLowerCase();
  const creatorKey = `tickets_${creatorEmail}`;

  // Get full user object
  const assigneeUser =
    assigneeEmail === "self"
      ? { email: creatorEmail, firstName: "You" }
      : users.find((user) => user.email === assigneeEmail);

  const newTicket = {
    id: crypto.randomUUID(),
    title,
    description,
    workType,
    status,
    assigned: {
      email: assigneeUser.email,
      name: assigneeUser.firstName,
    },
    createdAt: new Date().toISOString(),
  };

  // Load existing tickets
  const existingData = JSON.parse(localStorage.getItem(creatorKey)) || {};
  const existingMain = existingData.main || [];
  const existingAssignee = existingData.assignee || [];

  // Save based on assignee
  if (assigneeUser.email === creatorEmail) {
    // Assigned to myself → save to main
    const updatedMain = [...existingMain, newTicket];
    localStorage.setItem(
      creatorKey,
      JSON.stringify({ ...existingData, main: updatedMain })
    );
  } else {
    // Assigned to someone else → save to nested `assignee`
    const updatedAssignee = [...existingAssignee, newTicket];
    localStorage.setItem(
      creatorKey,
      JSON.stringify({ ...existingData, assignee: updatedAssignee })
    );
  }

  onClose();
};


  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2>Create Ticket</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmitTicket} className="ticket-form">
          <input name="title" placeholder="Title" required />
          <textarea
            style={{ width: "41rem" }}
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
