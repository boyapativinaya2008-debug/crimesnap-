import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/trackstatus.css";

export default function TrackStatus() {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchComplaints = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setComplaints(res.data);
        setLoading(false);

      } catch (err) {
        console.log("FETCH ERROR:", err);
        setLoading(false);
      }
    };

    fetchComplaints();

  }, []);


  return (
    <div className="track-container">

      <div className="track-card">

        <h1>📊 Track Complaint Status</h1>

        <p className="subtitle">
          Monitor your complaint progress in real-time
        </p>

        {/* LOADING STATE */}
        {loading && <p style={{ color: "#fff" }}>Loading...</p>}

        {/* EMPTY STATE */}
        {!loading && complaints.length === 0 && (
          <p style={{ color: "#fff" }}>No complaints found</p>
        )}

        <div className="status-list">

          {complaints.map((item) => (

            <div className="status-item" key={item._id}>

              <div className="left">

                <h3>{item.title}</h3>

                <p>
                  {item.category} • {item.location}
                </p>

              </div>

              <span
                className={`badge ${item.status
                  .toLowerCase()
                  .replace(" ", "")}`}
              >
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}