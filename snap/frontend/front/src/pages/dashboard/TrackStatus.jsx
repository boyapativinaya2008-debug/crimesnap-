import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/trackstatus.css";

export default function TrackStatus() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❗ No token
        if (!token) {
          if (isMounted) {
            setError("Unauthorized: Please login again.");
            setLoading(false);
          }
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API RESPONSE:", res.data);

        if (isMounted) {
          // ✅ FIXED: API returns ARRAY directly
          setComplaints(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);

        if (isMounted) {
          setError("Failed to fetch complaints. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchComplaints();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="track-container">
      <div className="track-card">
        <h1>📊 Track Complaint Status</h1>

        <p className="subtitle">
          Monitor your complaint progress in real-time
        </p>

        {/* LOADING */}
        {loading && <p className="info-text">Loading...</p>}

        {/* ERROR */}
        {!loading && error && (
          <p className="error-text">{error}</p>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && complaints.length === 0 && (
          <p className="info-text">No complaints found</p>
        )}

        {/* LIST */}
        <div className="status-list">
          {complaints.map((item) => (
            <div className="status-item" key={item._id}>
              <div className="left">
                <h3>{item.title || "No Title"}</h3>

                <p>
                  {item.category || "Unknown"} •{" "}
                  {item.location || "N/A"}
                </p>
              </div>

              <span
                className={`badge ${
                  (item.status || "pending")
                    .toLowerCase()
                    .replace(/\s/g, "")
                }`}
              >
                {item.status || "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}