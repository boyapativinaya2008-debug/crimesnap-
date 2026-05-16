import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

/* USER DASHBOARD */
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ReportComplaint from "./pages/dashboard/ReportComplaint";
import MyComplaints from "./pages/dashboard/MyComplaints";
import ComplaintDetails from "./pages/dashboard/ComplaintDetails";
import Profile from "./pages/dashboard/Profile";
import TrackStatus from "./pages/dashboard/TrackStatus";

/* ADMIN DASHBOARD */
import AdmindbLayout from "./pages/AdminDashboard/AdmindbLayout";
import Admindbhome from "./pages/AdminDashboard/Admindbhome";
import AdminReports from "./pages/AdminDashboard/AdminReports";
import AdminUsers from "./pages/AdminDashboard/AdminUsers";
import AdminOfficers from "./pages/AdminDashboard/AdminOfficers";
import AdminLocations from "./pages/AdminDashboard/AdminLocations";
import UpdateStatus from "./pages/AdminDashboard/UpdateStatus";

/* ================= USER PROTECTION ================= */

const RequireUser = ({ children }) => {

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {

    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ================= ADMIN PROTECTION ================= */

const RequireAdmin = ({ children }) => {

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {

    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ================= APP ================= */

export default function App() {

  return (

    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* USER AUTH */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <RequireUser>
            <DashboardLayout />
          </RequireUser>
        }
      >

        <Route
          index
          element={<DashboardHome />}
        />

        <Route
          path="report"
          element={<ReportComplaint />}
        />

        <Route
          path="my-complaints"
          element={<MyComplaints />}
        />

        <Route
          path="complaint/:id"
          element={<ComplaintDetails />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="track-status"
          element={<TrackStatus />}
        />

      </Route>

      {/* ADMIN AUTH */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdmindbLayout />
          </RequireAdmin>
        }
      >

        {/* ADMIN HOME */}
        <Route
          path="dashboard"
          element={<Admindbhome />}
        />

        {/* REPORTS */}
        <Route
          path="reports"
          element={<AdminReports />}
        />

        {/* UPDATE STATUS */}
        <Route
          path="update-status"
          element={<UpdateStatus />}
        />

        {/* USERS */}
        <Route
          path="users"
          element={<AdminUsers />}
        />

        {/* OFFICERS */}
        <Route
          path="officers"
          element={<AdminOfficers />}
        />

        {/* LOCATIONS */}
        <Route
          path="locations"
          element={<AdminLocations />}
        />

      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}