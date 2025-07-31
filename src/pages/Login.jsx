// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem(form.email));
    console.log("---->",stored)
    if (stored && stored.password === form.password) {
      login(stored);
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <>
    <Toaster />
    <div className="main">
      <form className="form-container" onSubmit={handleLogin} >
        <h1>Login</h1>
        <p style={{ fontSize: "1.8rem" }}>Hey Buddy Welcome Back!!! ❤️‍🔥</p>
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
          Login
        </button>
        <p>
          <Link to={"/register"}>
            <span className="click-here-font" style={{ color: "red" }}>click here !! </span>
          </Link>
          to register now.
        </p>
        <Link to="/">
          <p style={{ color: "black" }}>Back to Home</p>
        </Link>
      </form>
    </div>
    </>
  );
}

