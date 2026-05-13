import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/mycomplaints.css";
import bg from "../../assets/auth-bg.jpeg";

export default function MyComplaints() {
  const navigate = useNavigate();

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

        <div className="list-header">
          <span>Title</span>
          <span>Category</span>
          <span>Location</span>
          <span>Status</span>
        </div>

        {/* LOADING STATE */}
        {loading && <p style={{ color: "#fff" }}>Loading...</p>}

        {/* EMPTY STATE */}
        {!loading && complaints.length === 0 && (
          <p style={{ color: "#fff" }}>No complaints found</p>
        )}

        {/* DATA */}
        {complaints.map((item) => (
          <div
            className="list-row clickable"
            key={item._id}
            onClick={() => openDetails(item)}
          >
            <span>{item.title}</span>
            <span>{item.category}</span>
            <span>{item.location}</span>
            <span className={`status ${item.status.toLowerCase().replace(" ", "")}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}