import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

import "../styles/auth.css";
import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validations
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("All fields are required.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (!passwordsMatch) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name:            form.name,
        email:           form.email,
        password:        form.password,
        confirmPassword: form.confirmPassword,
        agree:           true,
        role:            "user",
      });

      console.log("Register success:", res.data);
      setSuccess("✅ Account created! Redirecting to login...");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("Register error:", err.response?.data);
      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg" style={{ backgroundImage: `url(${bg})` }}></div>

      <div className="page-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* LEFT */}
      <div className="auth-left">
        <div className="quote-box">
          <h1>Join CivicSnap</h1>
          <h1>Be the change your city needs</h1>
          <p><i>"Create your account and help build better communities"</i></p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>🤝 Become a Member</h2>

          {/* ERROR */}
          {error && <p className="auth-error-msg">{error}</p>}

          {/* SUCCESS */}
          {success && <p className="auth-success-msg">{success}</p>}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password (Min. 8 chars)"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD MATCH HINT */}
            {form.confirmPassword.length > 0 && (
              <p className={`password-hint ${passwordsMatch ? "match" : "no-match"}`}>
                {passwordsMatch ? "Passwords match ✔" : "Passwords do not match ❌"}
              </p>
            )}

            <button
              type="submit"
              className="auth-btn"
              disabled={!passwordsMatch || loading || form.password.length < 8}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}