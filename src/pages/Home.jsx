// src/pages/Home.jsx
import { Link } from "react-router-dom";
import '../styles/home.css'

export default function Home() {
  return (
    <div className="main" >
    <div className="form-container">
      <h1>Welcome to the Jira App! 🎊</h1>
      <p style={{fontSize:"2rem"}}>If You are here for the first time then Register  or Else <br /> you can Login and enjoy the services</p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <Link to="/login">
          <button className="btn-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn-btn">Register</button>
        </Link>
      </div>
    </div>
    </div>
  );
}
