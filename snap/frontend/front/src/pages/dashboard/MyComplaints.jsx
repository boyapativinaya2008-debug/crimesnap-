import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";

import "../../styles/mycomplaints.css";
import bg from "../../assets/auth-bg.jpeg";

export default function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchComplaints = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/complaints/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(res.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();

    /* ================= SOCKET EVENTS ================= */

    const onUpdate = () => fetchComplaints();

    socket.on("status-updated", onUpdate);
    socket.on("complaint-assigned", onUpdate);
    socket.on("new-complaint", onUpdate);

    return () => {
      socket.off("status-updated", onUpdate);
      socket.off("complaint-assigned", onUpdate);
      socket.off("new-complaint", onUpdate);
    };
  }, [fetchComplaints]);

  const openDetails = (item) => {
    navigate("/complaint-details", { state: item });
  };

  return (
    <div
      className="mycomplaints-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay"></div>

      <div className="mycomplaints-box">
        <h2>📄 My Complaints</h2>
        <p>View all complaints submitted by you</p>

        {/* HEADER */}
        <div className="list-header">
          <span>Title</span>
          <span>Category</span>
          <span>Location</span>
          <span>Status</span>
          <span>Assigned Officer</span>
        </div>

        {/* LOADING */}
        {loading && <p className="center">Loading...</p>}

        {/* EMPTY */}
        {!loading && complaints.length === 0 && (
          <p className="center">No complaints found</p>
        )}

        {/* LIST */}
        {!loading &&
          complaints.map((item) => (
            <div
              key={item._id}
              className="list-row clickable"

            >
              <span>{item.title}</span>
              <span>{item.category}</span>
              <span>{item.location}</span>

              <span
                className={`status ${
                  item.status === "Pending"
                    ? "pending"
                    : item.status === "In Progress"
                    ? "inprogress"
                    : "resolved"
                }`}
              >
                {item.status}
              </span>

              <span>{item.assignedOfficer || "Not Assigned"}</span>
            </div>
          ))}
      </div>
    </div>
  );
}