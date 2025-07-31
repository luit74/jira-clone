import '../styles/statusdropdown.css'

const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (status) => {
    onChange(status);
    setOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => setOpen(!open)}
      >
        <span className={getStatusClass(value)}>{value}</span>
        <span className="arrow">&#9662;</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {statusOptions.map((option) => (
            <div
              key={option}
              className="dropdown-option"
              onClick={() => handleSelect(option)}
            >
              <span className={getStatusClass(option)}>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;