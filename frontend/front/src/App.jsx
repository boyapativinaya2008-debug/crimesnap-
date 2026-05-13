// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// ── USER PAGES (existing) ─────────────────────────────────────────────────────
import Home             from "./pages/Home";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import DashboardLayout  from "./pages/dashboard/DashboardLayout";
import DashboardHome    from "./pages/dashboard/DashboardHome";
import ReportComplaint  from "./pages/dashboard/ReportComplaint";
import MyComplaints     from "./pages/dashboard/MyComplaints";
import ComplaintDetails from "./pages/dashboard/ComplaintDetails";
import Profile          from "./pages/dashboard/Profile";
import TrackStatus      from "./pages/dashboard/TrackStatus";

// ── ADMIN PAGES (new) ─────────────────────────────────────────────────────────
import AdminLogin     from "./pages/AdminLogin";
import AdminRegister  from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";

// ── AUTH GUARDS ───────────────────────────────────────────────────────────────

// Protect normal user routes — redirect to /login if not logged in as user
const RequireUser = ({ children }) => {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// Protect admin routes — redirect to /admin/login if not logged in as admin
const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

// ── APP ───────────────────────────────────────────────────────────────────────
 export default function App() {
  return (
    <Routes>

      {/* ── PUBLIC PAGES ── */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

          {/* ── USER DASHBOARD (protected) ── */}
      <Route
        path="/dashboard"
        element={
          <RequireUser>
            <DashboardLayout />
          </RequireUser>
        }
      >
        <Route index                  element={<DashboardHome />} />
        <Route path="report"          element={<ReportComplaint />} />
        <Route path="my-complaints"   element={<MyComplaints />} />
        <Route path="complaint/:id"   element={<ComplaintDetails />} />
        <Route path="profile"         element={<Profile />} />
        <Route path="track-status"    element={<TrackStatus />} />
      </Route>

      {/* ── ADMIN AUTH PAGES ── */}
      <Route path="/admin/login"    element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ── ADMIN DASHBOARD (protected) ── */}
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      {/* ── FALLBACK ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
