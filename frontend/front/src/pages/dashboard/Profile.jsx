import { useLocation } from "react-router-dom";
import "../../styles/profile.css";

export default function Profile() {
  const location = useLocation();

  const name = location.state?.name || "User";
  const email = location.state?.email || "user@example.com";

  return (
    <div className="profile-container">

      <div className="profile-card">

        <div className="avatar">
          👤
        </div>

        <h1>{name}</h1>
        <p>{email}</p>

        <div className="info">

          <div className="info-box">
            <h3>Role</h3>
            <p>User</p>
          </div>

          <div className="info-box">
            <h3>Complaints</h3>
            <p>0</p>
          </div>

          <div className="info-box">
            <h3>Status</h3>
            <p>Active</p>
          </div>

        </div>

      </div>

    </div>
  );
}