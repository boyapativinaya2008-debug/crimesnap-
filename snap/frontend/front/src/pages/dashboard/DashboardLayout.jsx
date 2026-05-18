import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo.png";

import "../../styles/dashboard.css";
import "../../styles/sidebar.css";

export default function DashboardLayout() {

  const navigate = useNavigate();

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <div className="dashboard-layout">

      {/* MOBILE MENU BUTTON */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div
        className={`sidebar ${sidebarOpen ? "active" : ""}`}
      >

        {/* LOGO */}
        <div className="brand">

          <img
            src={logo}
            alt="Logo"
          />

          <span>CrimeSnap</span>

        </div>

        {/* MENU */}
        <div className="menu">

          <button
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
          >
            🏠 Home
          </button>

          <button
            onClick={() => {
              navigate("/dashboard/report");
              setSidebarOpen(false);
            }}
          >
            📢 Report
          </button>

          <button
            onClick={() => {
              navigate("/dashboard/my-complaints");
              setSidebarOpen(false);
            }}
          >
            📄 My Complaints
          </button>

          <button
            onClick={() => {
              navigate("/dashboard/profile");
              setSidebarOpen(false);
            }}
          >
            👤 Profile
          </button>

          <button
            onClick={() => {
              navigate("/dashboard/track-status");
              setSidebarOpen(false);
            }}
          >
            📊 Track Status
          </button>

          {/* LOGOUT */}
          <button
            className="logout"
            onClick={handleLogout}
          >
            🔓 Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">

        <Outlet />

      </div>

    </div>
  );
}