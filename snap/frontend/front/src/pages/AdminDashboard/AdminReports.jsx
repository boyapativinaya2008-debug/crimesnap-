import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../../styles/adminReports.css";

export default function AdminReports() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/admin/complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaints(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // 🔥 FILTER LOGIC (SEARCH UPGRADE)
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.user?.name?.toLowerCase().includes(query) ||
        item.user?.email?.toLowerCase().includes(query)
      );
    });
  }, [complaints, search]);

  // STATUS CLASS
  const getStatusClass = (status) => {
    if (status === "Pending") return "pending";
    if (status === "Resolved") return "resolved";
    return "progress";
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>All Complaints</h1>
          <p className="sub-text">
            View and manage complaints submitted by users.
          </p>
        </div>

        
      </div>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>{complaints.length}</h2>
          <p>Total Complaints</p>
        </div>

        <div className="dashboard-card">
          <h2>
            {complaints.filter((i) => i.status === "Pending").length}
          </h2>
          <p>Pending Complaints</p>
        </div>

        <div className="dashboard-card">
          <h2>
            {complaints.filter((i) => i.status === "Resolved").length}
          </h2>
          <p>Resolved Complaints</p>
        </div>

        <div className="dashboard-card">
          <h2>
            {complaints.filter((i) => i.status === "In Progress").length}
          </h2>
          <p>In Progress</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        {/* TABLE TOP */}
        <div className="table-top">
          <h2>Complaints List</h2>

          {/* 🔥 SEARCH INPUT UPGRADED */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <h2 className="loading-text">Loading complaints...</h2>
        ) : filteredComplaints.length === 0 ? (
          <h2 className="loading-text">No complaints found</h2>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {item.user?.name?.charAt(0)}
                        </div>
                        {item.user?.name}
                      </div>
                    </td>

                    <td>{item.user?.email}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.location}</td>

                    <td>
                      <span
                        className={`status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}