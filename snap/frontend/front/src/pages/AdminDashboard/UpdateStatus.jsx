import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/updateStatus.css";

export default function UpdateStatus() {

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH COMPLAINTS ================= */
  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/admin/complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setComplaints(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchComplaints();

  }, []);

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async (id, status) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/admin/update-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComplaints((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredComplaints = complaints.filter((item) => {

    const keyword = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(keyword) ||
      item.category?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword) ||
      item.user?.name?.toLowerCase().includes(keyword)
    );
  });

  return (

    <div className="update-page">

      {/* HEADER */}
      <div className="update-header">

        <div>
          <h1>🔄 Update Complaint Status</h1>
          <p>Manage and update complaint progress.</p>
        </div>

      </div>

      {/* SEARCH BOX */}
      <div style={{ marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="Search by user, title, category, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

      </div>

      {/* TABLE */}
      <div className="update-table-wrapper">

        <table className="update-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>

            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            ) : (

              filteredComplaints.map((item, index) => (

                <tr key={item._id}>

                  <td>{index + 1}</td>
                  <td>{item.user?.name}</td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>

                  <td>
                    <span className={`status ${item.status}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          item._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}