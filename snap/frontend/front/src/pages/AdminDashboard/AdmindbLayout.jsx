import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/admindashboard.css";
import logo from "../../assets/logo.png";

export default function AdmindbLayout() {
  const [admin, setAdmin] = useState(null);

  /* ================= LOAD ADMIN ================= */
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setAdmin(JSON.parse(user));
    }
  }, []);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">

        {/* TOP SECTION */}
        <div className="sidebar-top">

          <div className="logo-box">
            <img src={logo} alt="CrimeSnap Logo" />
            <h2>CrimeSnap</h2>
            
          </div>
<h3>ADMIN DASHBOARD</h3>
          <div className="sidebar-menu">

            <Link to="/admin/dashboard">📊 Dashboard</Link>
            <Link to="/admin/reports">📋 Reports</Link>
            <Link to="/admin/users">👤 Users</Link>
            <Link to="/admin/update-status">🛠️ Update Status</Link>
            <Link to="/admin/officers">👮 Officers</Link>
            <Link to="/admin/locations">📍 Locations</Link>
            <Link to="/">🚪 Logout</Link>
          </div>
        </div>
        {/* ADMIN INFO */}
        <div className="sidebar-bottom">
          <div className="admin-user">
            <h4>{admin?.name || "ADMIN USER"}</h4>
            <p>
              {admin?.role === "admin"
                ? "Super Administrator"
                : "User"}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">

        <div className="admin-header">
          <h1>HELLO {admin?.name || "ADMIN"} </h1>
        </div>

        <Outlet />

      </div>

    </div>
  );
}