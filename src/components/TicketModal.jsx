import "../styles/ticketmodal.css";

export default function TicketModal({ onClose }) {
  const workTypeOptions = ["Bug", "Fix", "Improvement", "Task"];
  const statusOptions = [
    "DONE",
    "IN DEVELOPMENT",
    "IN TESTING",
    "READY FOR AUDIT",
    "READY FOR PROD",
    "READY FOR TESTING",
    "IN AUDIT",
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const workType = e.target.workType.value;
    const status = e.target.status.value;

    const newTicket = {
      title,
      description,
      workType,
      status,
      createdAt: new Date().toISOString(),
    };

    const userEmail = localStorage.getItem("loggedInUser");
    const ticketKey = `tickets_${userEmail}`;

    const existingTickets = JSON.parse(localStorage.getItem(ticketKey)) || [];
    const updatedTickets = [...existingTickets, newTicket];

    localStorage.setItem(ticketKey, JSON.stringify(updatedTickets));


    console.log("Ticket saved:", ticketKey);
    console.log("updatedTickets:", updatedTickets);

    // onSubmit(newTicket);
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
          <textarea name="description" placeholder="Description" required />

          <select name="workType" required>
            <option value="">Select Work Type</option>
            {workTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select name="status" required className="status-dropdown">
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
