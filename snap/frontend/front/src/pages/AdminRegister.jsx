import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/auth.css";
import "../styles/admin.css";
import logo from "../assets/logo.png";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const pwMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.adminCode
    )
      return setError("All required fields must be filled.");

    if (form.password.length < 8)
      return setError("Password must be at least 8 characters.");

    if (!pwMatch)
      return setError("Passwords do not match.");

    if (!form.agree)
      return setError("You must accept the terms and conditions.");

    try {
      setLoading(true);

      await api.post("/auth/register", {
        ...form,
        role: "admin",
      });

      setSuccess("Admin account created! Redirecting...");

      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">

      {/* LEFT PANEL */}
      <div className="admin-auth-left">

        <div className="admin-brand">

          <div className="admin-logo">
            <img
              src={logo}
              alt="CivicSnap Logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
              }}
            />
            <span style={{ marginLeft: "10px", fontSize: "20px", fontWeight: "bold" }}>
              CivicSnap
            </span>
          </div>

          <p className="admin-brand-sub">Admin Panel</p>
        </div>

        <div className="admin-auth-hero">
          <h1>Join the Admin Team</h1>
          <p>
            Create your administrator account to manage civic reports, officers,
            and city services.
          </p>
        </div>

        <div className="admin-auth-footer-text">
          © 2026 CivicSnap
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="admin-auth-right">

        <div className="admin-auth-card">

          <div className="admin-card-header">
            <div className="admin-badge">🛡️ Admin Registration</div>
            <h2>Create admin account</h2>
          </div>

          {error && <div className="admin-error-box">{error}</div>}
          {success && <div className="admin-success-box">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form">

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <input
              name="adminCode"
              placeholder="Admin Code"
              value={form.adminCode}
              onChange={handleChange}
              required
            />

            <label>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              I agree to terms
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Create Admin"}
            </button>

          </form>

          <div className="admin-switch-link">
            Already have an account? <Link to="/admin/login">Login</Link>
          </div>

        </div>
      </div>
    </div>
  );
}