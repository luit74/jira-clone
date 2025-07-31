// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const existingUser = localStorage.getItem(form.email);
    if (existingUser) {
      toast.error("User exists. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      localStorage.setItem(form.email, JSON.stringify(form));
      toast.success("Registration successful. You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <>
      <Toaster />
      <div className="main">
        <form className="form-container" onSubmit={handleRegister}>
          <h1>Register</h1>
          <p style={{ fontSize: "1.8rem" }}>
            Quickly register yourself and enjoy{" "}
            <span className="title">JIRA</span> 🎉
          </p>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button style={{ marginTop: "1rem" }} type="submit">
            Register
          </button>
          <p style={{ color: "black" }}>
            <Link to={"/login"}>
              <span className="click-here-font">click here !! </span>
            </Link>
            to go to Login Page.
          </p>
          <Link style={{ marginTop: "1.2rem" }} to="/">
            <p style={{ color: "black" }}>Back to Home</p>
          </Link>
        </form>
      </div>
    </>
  );
}
