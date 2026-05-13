// src/pages/AdminDashboard/AdmindbLayout.jsx

import React from "react";

import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

function AdminDbLayout() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>CivicSnap Admin</h2>

        <hr />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Link
            to="/admin/dashboard"
            style={linkStyle}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/dashboard/reports"
            style={linkStyle}
          >
            Reports
          </Link>

          <Link
            to="/admin/dashboard/users"
            style={linkStyle}
          >
            Users
          </Link>

          <Link
            to="/admin/dashboard/officers"
            style={linkStyle}
          >
            Officers
          </Link>

          <Link
            to="/admin/dashboard/locations"
            style={linkStyle}
          >
            Locations
          </Link>

          <button
            onClick={logoutHandler}
            style={{
              padding: "10px",
              border: "none",
              background: "red",
              color: "white",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "20px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}

      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f3f4f6",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px",
  background: "#1f2937",
  borderRadius: "5px",
};

export default AdminDbLayout;