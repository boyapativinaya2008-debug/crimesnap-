import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import bg from "../assets/home-bg.jpeg";
import logo from "../assets/logo.png";

export default function Home() {

  const quotes = [
    "Empowering citizens to improve their city.",
    "Your voice creates real change.",
    "Report issues. See real impact.",
    "Together we build smarter communities.",
    "Every action matters."
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {

    const interval = setInterval(() => {

      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 300);

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* NAVBAR */}
      <header className="navbar">

        {/* LOGO */}
        <div className="logo-box">
          <img src={logo} alt="logo" />
          <span>CivicSnap</span>
        </div>

        {/* NAV LINKS */}
        <nav className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            🔐 Sign In
          </Link>

          <Link to="/register">
            🤝 Join
          </Link>

          {/* ADMIN BUTTON */}
          <Link
            to="/admin/login"
            className="admin-btn"
          >
            🛠 Admin
          </Link>

        </nav>

      </header>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <h1>Make Your City Better 🚀</h1>

          <p className={`quote ${fade ? "fade-in" : "fade-out"}`}>
            {quotes[index]}
          </p>

          {/* HERO BUTTONS */}
          <div className="hero-buttons">

            <Link
              to="/register"
              className="btn primary"
            >
              🚀 Get Started
            </Link>

            <Link
              to="/login"
              className="btn outline"
            >
              🔐 Login
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}