import { useState } from "react";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";

import ReportComplaint from "./dashboard/ReportComplaint";
import MyComplaints from "./dashboard/MyComplaints";

export default function Dashboard() {
  const [page, setPage] = useState("home");

  return (
    <div className="dash-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <img src={logo} alt="logo" />
          <h2>CivicSnap</h2>
        </div>

        <div className="menu">

          <button onClick={() => setPage("home")}>
            🏠 Home
          </button>

          <button onClick={() => setPage("report")}>
            📢 Report Complaint
          </button>

          <button onClick={() => setPage("my")}>
            📄 My Complaints
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main">

        {page === "home" && (
          <div className="home-box">
            <h1>👋 Welcome to CivicSnap</h1>
            <p>Report issues and improve your city</p>
          </div>
        )}

        {page === "report" && <ReportComplaint />}

        {page === "my" && <MyComplaints />}

      </main>

    </div>
  );
}