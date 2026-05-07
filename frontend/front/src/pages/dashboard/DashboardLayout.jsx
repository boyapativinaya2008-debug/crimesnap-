import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/dashboard.css";
import "../../styles/sidebar.css";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="brand">
          <img src={logo} alt="Logo" />
        </div>

        <div className="menu">

          <button onClick={() => navigate("/dashboard")}>
            Home
          </button>

          <button onClick={() => navigate("/dashboard/report")}>
            Report
          </button>

          <button onClick={() => navigate("/dashboard/my-complaints")}>
            My Complaints
          </button>

        </div>

      </div>  {/* ✅ CLOSE SIDEBAR HERE */}

      {/* RIGHT SIDE CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}