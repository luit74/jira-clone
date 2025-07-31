// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div>
        <h1>Welcome {user?.firstName || "User"}!</h1>
      </div>
      <h1 style={{ textAlign: "center", marginTop: "10rem" }}>
        This is Dashboard
      </h1>
    </div>
  );
}
