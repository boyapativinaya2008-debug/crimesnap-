import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/auth.css";
import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // optional: simple check
    if (!form.email || !form.password) return;

    // 🚀 redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">

      {/* BACKGROUND */}
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* LOGO */}
      <div className="page-logo">
        <img src={logo} />
      </div>

      {/* LEFT QUOTE */}
      <div className="auth-left">
        <div className="quote-box">
          <h1>Welcome Back 👋</h1>
          <p>
            “Your voice has the power to improve streets, solve issues, and
            strengthen communities. CivicSnap helps citizens and authorities
            work together for a better tomorrow”
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN BOX */}
      <div className="auth-right">

        <div className="auth-box">

          <h2>Login</h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <button className="auth-btn" type="submit"  onClick={() => navigate("/dashboard")}>
               👤Login
            </button>

          </form>

          <div className="auth-link">
            New user? <Link to="/register">Register</Link>
          </div>

        </div>

      </div>

    </div>
  );
}