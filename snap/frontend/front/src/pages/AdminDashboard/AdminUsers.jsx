import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/adminreports.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
  useEffect(() => {
    fetchUsers();
  }, []);

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

      const seen = new Set();
      const uniqueUsers = [];

      res.data.forEach((complaint) => {
        const user = complaint.user;

        if (!user || !user.email) return;

        if (!seen.has(user.email)) {
          seen.add(user.email);

          uniqueUsers.push({
            id: user._id,
            name: user.name,
            email: user.email,
            status: user.status || "Active",
          });
        }
      });

      setUsers(uniqueUsers);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= BLOCK USER =================
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
        prev.map((u) =>
          u.id === id ? { ...u, status: "Blocked" } : u
        )
      );
    } catch (err) {
      console.log("BLOCK ERROR:", err);
    }
  };

  // ================= UNBLOCK USER =================
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
        prev.map((u) =>
          u.id === id ? { ...u, status: "Active" } : u
        )
      );
    } catch (err) {
      console.log("UNBLOCK ERROR:", err);
    }
  };

  // ================= LOADING =================
  if (loading) return <h2>Loading users...</h2>;

  // ================= UI =================
  return (
    <div className="admin-page">
      <h1>Admin - Users Management</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id || user.email}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <span
                  style={{
                    color:
                      user.status === "Blocked"
                        ? "red"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </span>
              </td>

              <td>
                {user.status === "Blocked" ? (
                  <button
                    onClick={() => unblockUser(user.id)}
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
                    onClick={() => blockUser(user.id)}
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