// src/layout/Layout.jsx
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import "../styles/layout.css"; 

export default function Layout() {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
