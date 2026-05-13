import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles/dashboardHome.css";

export default function DashboardHome() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "User",
    email: ""
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  // GET USER + STATS
  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        // USER
        const userRes = await axios.get(
          "http://localhost:3000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(userRes.data);

        // COMPLAINT STATS
        const complaintRes = await axios.get(
          "http://localhost:3000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const complaints = complaintRes.data;

        // CALCULATE STATS
        const total = complaints.length;
        const pending = complaints.filter(
          c => c.status === "Pending"
        ).length;

        const resolved = complaints.filter(
          c => c.status === "Resolved"
        ).length;

        setStats({
          total,
          pending,
          resolved
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, []);


  return (
    <div className="home-container">

      <div className="home-card">

        {/* HEADER */}
        <div className="top-section">

          <div>

            <h1>
              👋 Welcome, {user.name}
            </h1>

            <p className="subtitle">
              Manage complaints and improve your city smarter.
            </p>

          </div>

          <div
            className="profile-circle"
            onClick={() => navigate("/dashboard/profile")}
          >
            👤
          </div>

        </div>

        {/* STATS */}
        <div className="stats-row">

          <div className="mini-card">
            <h2>{stats.total}</h2>
            <p>Total Complaints</p>
          </div>

          <div className="mini-card">
            <h2>{stats.pending}</h2>
            <p>Pending Cases</p>
          </div>

          <div className="mini-card">
            <h2>{stats.resolved}</h2>
            <p>Resolved Cases</p>
          </div>

        </div>

        {/* FEATURES */}
        <div className="card-grid">

          <div
            className="stat-card"
            onClick={() => navigate("/dashboard/report")}
          >
            <h2>📢</h2>
            <h3>Report Complaint</h3>
            <p>Quickly report issues happening in your area.</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/dashboard/my-complaints")}
          >
            <h2>📄</h2>
            <h3>My Complaints</h3>
            <p>View and track all submitted complaints.</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/dashboard/track-status")}
          >
            <h2>📊</h2>
            <h3>Track Status</h3>
            <p>Monitor complaint progress in real time.</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/dashboard/profile")}
          >
            <h2>👤</h2>
            <h3>My Profile</h3>
            <p>Manage account and personal information.</p>
          </div>

        </div>

      </div>

    </div>
  );
}