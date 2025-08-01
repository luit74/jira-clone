
const OthersTasks = ({ tickets }) => {
  if (tickets.length === 0) {
    return <p>No tasks assigned to others.</p>;
  }

  return (
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
};

export default OthersTasks;
