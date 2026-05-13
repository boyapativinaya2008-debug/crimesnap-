import { Outlet, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import "../../styles/dashboard.css";
import "../../styles/sidebar.css";

export default function DashboardLayout() {

  const navigate = useNavigate();

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear(); // optional
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div className="sidebar">

        {/* LOGO */}
        <div className="brand">

          <img src={logo} alt="Logo" />

          <span>CivicSnap</span>

        </div>

        {/* MENU */}
        <div className="menu">

          <button onClick={() => navigate("/dashboard")}>
            🏠 Home
          </button>

          <button onClick={() => navigate("/dashboard/report")}>
            📢 Report
          </button>

          <button onClick={() => navigate("/dashboard/my-complaints")}>
            📄 My Complaints
          </button>

          <button onClick={() => navigate("/dashboard/profile")}>
            👤 Profile
          </button>

          <button onClick={() => navigate("/dashboard/track-status")}>
            📊 Track Status
          </button>

          {/* LOGOUT */}
          <button className="logout" onClick={handleLogout}>
            🔓 Logout
          </button>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}