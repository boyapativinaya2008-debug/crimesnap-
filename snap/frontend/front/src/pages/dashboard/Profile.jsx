import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
  });

  const [complaintsCount, setComplaintsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        // USER API
        const userRes = await axios.get(
          "http://localhost:3000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(userRes.data);

        // COMPLAINTS API
        const compRes = await axios.get(
          "http://localhost:3000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("COMPLAINTS:", compRes.data);

        // ✅ FIXED FOR ARRAY RESPONSE
        setComplaintsCount(
          Array.isArray(compRes.data) ? compRes.data.length : 0
        );
      } catch (err) {
        console.log("PROFILE ERROR:", err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h1>{user.name}</h1>

        <p className="email">{user.email}</p>

        <div className="info">
          <div className="info-box">
            <h3>Role</h3>
            <p>User</p>
          </div>

          <div className="info-box">
            <h3>Complaints</h3>
            <p>{complaintsCount}</p>
          </div>

          <div className="info-box">
            <h3>Status</h3>
            <p>Active</p>
          </div>
        </div>

        <button
          className="profile-btn logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}