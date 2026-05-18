import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserShield
} from "react-icons/fa";

import axios from "axios";

import "../styles/auth.css";

import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function Login() {

  const navigate = useNavigate();

  // FORM STATE
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // ROLE STATE
  const [role, setRole] = useState("user");

  // ERROR STATE
  const [error, setError] = useState("");

  // LOADING STATE
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          ...form,
          role
        }
      );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // REDIRECT
      if (res.data.user.role === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/dashboard");
      }

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="auth-container">

      {/* BACKGROUND */}
      <div
        className="auth-bg"
        style={{
          backgroundImage: `url(${bg})`
        }}
      ></div>

      {/* LOGO */}
      <div className="page-logo">

        <img
          src={logo}
          alt="logo"
        />

      </div>

      {/* LEFT SIDE */}
      <div className="auth-left">

        <div className="quote-box">

          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Your voice can improve streets,
            solve issues, and build safer
            communities using CrimeSnap.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-box">

          {/* ROLE TOGGLE */}
          <div className="role-toggle">

            <button
              type="button"
              className={`role-btn ${
                role === "user"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setRole("user");
                setError("");
              }}
            >
              <FaUser className="role-icon" />
              User
            </button>

            <button
              type="button"
              className={`role-btn ${
                role === "admin"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              <FaUserShield className="role-icon" />
              Admin
            </button>

          </div>

          {/* TITLE */}
          <h2>
            {
              role === "admin"
              ? "🛡️ Admin Login"
              : "👤 User Login"
            }
          </h2>

          {/* ERROR */}
          {
            error && (
              <p className="auth-error-msg">
                {error}
              </p>
            )
          }

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input-group">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <FaLock className="input-icon" />

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

            {/* BUTTON */}
            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
            >
              {
                loading
                ? "Logging in..."
                : role === "admin"
                ? "Login as Admin"
                : "Login as User"
              }
            </button>

          </form>

          {/* LINKS */}
          {
            role === "user" && (
              <div className="auth-link">

                New user?

                <Link to="/register">
                  Register
                </Link>

              </div>
            )
          }

          {
            role === "admin" && (
              <div className="auth-link">

                New admin?

                <Link to="/admin/register">
                  Register here
                </Link>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}