import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/admindashboard.css";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const lineData = [
  { date: "Apr 8",  total: 380, resolved: 210, pending: 85 },
  { date: "Apr 13", total: 420, resolved: 240, pending: 95 },
  { date: "Apr 18", total: 490, resolved: 280, pending: 110 },
  { date: "Apr 23", total: 540, resolved: 310, pending: 120 },
  { date: "Apr 28", total: 610, resolved: 360, pending: 130 },
  { date: "May 3",  total: 680, resolved: 410, pending: 125 },
  { date: "May 7",  total: 740, resolved: 460, pending: 116 },
];

const pieData = [
  { name: "Road Issues",    value: 437, color: "#3b82f6" },
  { name: "Street Light",   value: 312, color: "#22c55e" },
  { name: "Garbage & Waste",value: 187, color: "#f59e0b" },
  { name: "Water Supply",   value: 125, color: "#a855f7" },
  { name: "Others",         value: 187, color: "#94a3b8" },
];

const recentReports = [
  { id: "#CS-1256", title: "Pothole on 5th Main Road",  area: "Koramangala, Bengaluru", time: "2 min ago",  status: "Pending",     img: "🛣️" },
  { id: "#CS-1255", title: "Broken Street Light",       area: "HSR Layout, Bengaluru",  time: "15 min ago", status: "In Progress", img: "💡" },
  { id: "#CS-1254", title: "Garbage Overflow",          area: "Indiranagar, Bengaluru", time: "1 hour ago", status: "Resolved",    img: "🗑️" },
  { id: "#CS-1253", title: "Water Leakage",             area: "Jayanagar, Bengaluru",   time: "2 hours ago",status: "In Progress", img: "💧" },
  { id: "#CS-1252", title: "Damaged Footpath",          area: "Whitefield, Bengaluru",  time: "3 hours ago",status: "Pending",     img: "🚶" },
];

const officers = [
  { name: "Rahul Sharma",  resolved: 128, avatar: "RS" },
  { name: "Sneha Reddy",   resolved: 97,  avatar: "SR" },
  { name: "Arjun Nair",    resolved: 89,  avatar: "AN" },
  { name: "Pooja Singh",   resolved: 76,  avatar: "PS" },
  { name: "Vikram Patel",  resolved: 65,  avatar: "VP" },
];

const navItems = [
  { icon: "⊞", label: "Dashboard",       active: true },
  { icon: "📋", label: "Reports",        hasArrow: true },
  { icon: "👤", label: "Users" },
  { icon: "🏛️", label: "Departments" },
  { icon: "👮", label: "Officers" },
  { icon: "🏷️", label: "Categories" },
  { icon: "📍", label: "Locations" },
  { icon: "📢", label: "Announcements" },
  { icon: "📊", label: "Analytics" },
  { icon: "⚙️", label: "System Settings" },
  { icon: "📝", label: "Audit Logs" },
];

const statusClass = { Pending: "status-pending", "In Progress": "status-progress", Resolved: "status-resolved" };

// ── COMPONENT ──────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activePeriod, setActivePeriod] = useState("30D");
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Admin User"}');

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="ad-root">

      {/* ── SIDEBAR ── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <div className="ad-brand-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2"/>
              <path d="M16 4L6 10V22L16 28L26 22V10L16 4Z" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="ad-brand-name">CivicSnap</div>
            <div className="ad-brand-role">Admin Panel</div>
          </div>
        </div>

        <nav className="ad-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`ad-nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              <span className="ad-nav-label">{item.label}</span>
              {item.hasArrow && <span className="ad-nav-arrow">⌄</span>}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-user">
          <div className="ad-user-avatar">AU</div>
          <div className="ad-user-info">
            <div className="ad-user-name">{user.name || "Admin User"}</div>
            <div className="ad-user-role">Super Administrator</div>
          </div>
          <button className="ad-user-more" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ad-main">

        {/* ── TOPBAR ── */}
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <h1 className="ad-page-title">Dashboard</h1>
            <p className="ad-page-sub">Welcome back, Admin! Here's what's happening in your city today.</p>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-search-box">
              <span>🔍</span>
              <input placeholder="Search reports, users..." />
            </div>
            <button className="ad-notif-btn">
              🔔
              <span className="ad-notif-badge">3</span>
            </button>
            <div className="ad-topbar-avatar">AU</div>
          </div>
        </header>

        <div className="ad-content">

          {/* ── STAT CARDS ── */}
          <div className="ad-stat-grid">
            <div className="ad-stat-card">
              <div className="ad-stat-icon blue">📋</div>
              <div className="ad-stat-body">
                <div className="ad-stat-label">Total Reports</div>
                <div className="ad-stat-value">1,248</div>
                <div className="ad-stat-change up">↑ 18.5% from last month</div>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon green">✅</div>
              <div className="ad-stat-body">
                <div className="ad-stat-label">Resolved Reports</div>
                <div className="ad-stat-value">856</div>
                <div className="ad-stat-change up">↑ 16.4% from last month</div>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon orange">⏱️</div>
              <div className="ad-stat-body">
                <div className="ad-stat-label">In Progress</div>
                <div className="ad-stat-value">276</div>
                <div className="ad-stat-change down">↓ 3.2% from last month</div>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon purple">⏳</div>
              <div className="ad-stat-body">
                <div className="ad-stat-label">Pending Reports</div>
                <div className="ad-stat-value">116</div>
                <div className="ad-stat-change down">↓ 8.7% from last month</div>
              </div>
            </div>
          </div>

          {/* ── CHARTS ROW ── */}
          <div className="ad-charts-row">

            {/* LINE CHART */}
            <div className="ad-card ad-line-chart-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Reports Overview</span>
                <div className="ad-period-tabs">
                  {["7D","30D","90D","1Y"].map(p => (
                    <button
                      key={p}
                      className={`ad-period-tab ${activePeriod === p ? "active" : ""}`}
                      onClick={() => setActivePeriod(p)}
                    >{p}</button>
                  ))}
                </div>
              </div>
              <div className="ad-chart-legend">
                <span className="legend-dot blue"></span> Total Reports
                <span className="legend-dot green"></span> Resolved
                <span className="legend-dot orange"></span> Pending
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="total"    stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pending"  stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div className="ad-card ad-pie-chart-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Reports by Category</span>
                <select className="ad-period-select"><option>This Month</option></select>
              </div>
              <div className="ad-pie-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "22px", fontWeight: "700", fill: "#1e293b" }}>1,248</text>
                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fill: "#94a3b8" }}>Total</text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ad-pie-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="ad-pie-legend-item">
                    <span className="ad-pie-dot" style={{ background: d.color }}></span>
                    <span className="ad-pie-legend-label">{d.name}</span>
                    <span className="ad-pie-legend-pct">{Math.round(d.value / 1248 * 100)}% ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="ad-bottom-row">

            {/* RECENT REPORTS */}
            <div className="ad-card ad-recent-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Recent Reports</span>
                <button className="ad-view-all">View All ▾</button>
              </div>
              <div className="ad-report-list">
                {recentReports.map((r) => (
                  <div key={r.id} className="ad-report-row">
                    <div className="ad-report-thumb">{r.img}</div>
                    <div className="ad-report-info">
                      <div className="ad-report-title">{r.title}</div>
                      <div className="ad-report-area">{r.area}</div>
                    </div>
                    <div className="ad-report-meta">
                      <div className="ad-report-id">{r.id}</div>
                      <div className="ad-report-time">{r.time}</div>
                    </div>
                    <span className={`ad-status-badge ${statusClass[r.status]}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="ad-card ad-map-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Reports by Location</span>
              </div>
              <div className="ad-map-body">
                <div className="ad-map-placeholder">
                  <div className="ad-map-label">📍 Bengaluru</div>
                  <div className="ad-map-dot" style={{ top: "35%", left: "50%" }}></div>
                  <div className="ad-map-dot hot" style={{ top: "45%", left: "30%" }}></div>
                  <div className="ad-map-dot hot" style={{ top: "55%", left: "65%" }}></div>
                  <div className="ad-map-dot" style={{ top: "65%", left: "45%" }}></div>
                </div>
                <button className="ad-view-map-btn">View Full Map →</button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="ad-right-col">

              {/* TOP OFFICERS */}
              <div className="ad-card ad-officers-card">
                <div className="ad-card-header">
                  <span className="ad-card-title">Top Officers</span>
                  <button className="ad-view-all">View All</button>
                </div>
                {officers.map((o, i) => (
                  <div key={i} className="ad-officer-row">
                    <div className="ad-officer-avatar">{o.avatar}</div>
                    <div className="ad-officer-name">{o.name}</div>
                    <div className="ad-officer-resolved">{o.resolved} Resolved</div>
                  </div>
                ))}
              </div>

              {/* ANNOUNCEMENTS */}
              <div className="ad-card ad-announce-card">
                <div className="ad-announce-icon">📢</div>
                <div className="ad-announce-body">
                  <div className="ad-announce-title">Announcements</div>
                  <div className="ad-announce-sub">No new announcements</div>
                </div>
                <button className="ad-announce-btn">Create Announcement</button>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="ad-footer">
          <span>© 2026 CivicSnap. All rights reserved.</span>
          <span>🛡️ Secure. Transparent. Connected.</span>
        </footer>
      </main>
    </div>
  );
}
