import { useLocation } from "react-router-dom";
import "../../styles/dashboardHome.css";

export default function DashboardHome() {
  const location = useLocation();
  const name = location.state?.name || "User";

  return (
    <div className="home-container">

      <div className="home-card">

        <h1>👋 Welcome, {name}</h1>
        <p className="subtitle">
          Here’s your dashboard overview
        </p>

        <div className="card-grid">

          <div className="stat-card">
            <h2>📢</h2>
            <p>Report Issues</p>
          </div>

          <div className="stat-card">
            <h2>📄</h2>
            <p>My Complaints</p>
          </div>

          <div className="stat-card">
            <h2>📊</h2>
            <p>Status Tracking</p>
          </div>

          <div className="stat-card">
            <h2>👤</h2>
            <p>Profile</p>
          </div>

        </div>

      </div>

    </div>
  );
}