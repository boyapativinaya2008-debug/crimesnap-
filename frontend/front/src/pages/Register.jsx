import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/auth.css";
import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordsMatch) return;

    alert("Registered Successfully 🎉");
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

      {/* LEFT */}
      <div className="auth-left">
        <div className="quote-box">
          <h1>Join CivicSnap</h1>
          <h1>Be the change your city needs</h1>
          <p><i>"Create your account and be a part of
            building better and safer communities
         </i> </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">

        <div className="auth-box">

          <h2>🤝 Become a Member</h2>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            {/* CONFIRM PASSWORD (WITH MATCH CHECK) */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD MATCH MESSAGE */}
            {form.confirmPassword.length > 0 && (
              <p
                style={{
                  fontSize: "12px",
                  marginBottom: "10px",
                  color: passwordsMatch ? "lightgreen" : "#ff4d4d"
                }}
              >
                {passwordsMatch
                  ? "Passwords match ✔"
                  : "Passwords do not match ❌"}
              </p>
            )}

            {/* BUTTON */}
            <button className="auth-btn" disabled={!passwordsMatch} onClick={() => navigate("/login")}>
              Register
            </button>

          </form>

          <div className="auth-link">
            Already have account? <Link to="/login">Login</Link>
          </div>

        </div>

      </div>

    </div>
  );
}