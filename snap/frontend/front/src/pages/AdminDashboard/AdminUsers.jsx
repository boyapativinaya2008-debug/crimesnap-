import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/adminreports.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
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
        console.log("Data:", res.data);
        const uniqueUsers = [];
        const seen = new Set();

        res.data.forEach((complaint) => {
          const user = complaint.user;

          // ✅ safety check
          if (!user || !user.email) return;

          if (!seen.has(user.email)) {
            seen.add(user.email);

            uniqueUsers.push({
              _id: user._id || user.email,
              name: user.name || "Unknown",
              email: user.email,

              // 🔥 IMPORTANT FIX: real status from backend
              status: user.status || "Active",
            });
          }
        });

        setUsers(uniqueUsers);
      } catch (err) {
        console.log("FETCH USERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= BLOCK USER ================= */
  const blockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/admin/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, status: "Blocked" }
            : user
        )
      );
    } catch (err) {
      console.log("BLOCK ERROR:", err);
    }
  };

  /* ================= UNBLOCK USER ================= */
  const unblockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/admin/users/unblock/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, status: "Active" }
            : user
        )
      );
    } catch (err) {
      console.log("UNBLOCK ERROR:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="admin-page">
      <h1>Users Management</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || user.email}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <span
                  style={{
                    color:
                      user.status === "Blocked"
                        ? "red"
                        : "limegreen",
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </span>
              </td>

              <td>
                {user.status === "Blocked" ? (
                  <button
                    onClick={() =>
                      user._id && unblockUser(user._id)
                    }
                    style={{
                      background: "green",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      user._id && blockUser(user._id)
                    }
                    style={{
                      background: "red",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}