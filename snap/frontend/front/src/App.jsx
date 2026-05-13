// src/App.jsx

import React from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

/* AUTH PAGES */

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
import TrackStatus from "./pages/dashboard/TrackStatus";
import Profile from "./pages/dashboard/Profile";

/* ADMIN DASHBOARD */

import AdminDbLayout from "./pages/AdminDashboard/AdmindbLayout";

import Admindbhome from "./pages/AdminDashboard/Admindbhome";

import AdminReports from "./pages/AdminDashboard/AdminReports";

import AdminUsers from "./pages/AdminDashboard/AdminUsers";

import AdminOfficers from "./pages/AdminDashboard/AdminOfficers";

import AdminLocations from "./pages/AdminDashboard/AdminLocations";

import UpdateStatus from "./pages/AdminDashboard/UpdateStatus";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ADMIN AUTH */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />

      {/* USER DASHBOARD */}

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
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
          path="track-status"
          element={<TrackStatus />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />
      </Route>

      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin/dashboard"
        element={<AdminDbLayout />}
      >
        <Route
          index
          element={<Admindbhome />}
        />

        <Route
          path="reports"
          element={<AdminReports />}
        />

        <Route
          path="users"
          element={<AdminUsers />}
        />

        <Route
          path="officers"
          element={<AdminOfficers />}
        />

        <Route
          path="locations"
          element={<AdminLocations />}
        />

        <Route
          path="update-status/:id"
          element={<UpdateStatus />}
        />
      </Route>

    </Routes>
  );
}

export default App;