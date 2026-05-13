// src/pages/AdminDashboard/AdminOfficers.jsx

import {
  useEffect,
  useState,
} from "react";

import API from "../../api/api";

export default function AdminOfficers() {

  const [officers, setOfficers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      department: "",
      rank: "",
    });

  useEffect(() => {
    fetchOfficers();
  }, []);

  /* FETCH OFFICERS */

  const fetchOfficers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(
            "/api/admin/officers",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setOfficers(
          res.data
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to fetch officers"
        );
      }
    };

  /* HANDLE CHANGE */

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  /* ADD OFFICER */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.post(
            "/api/admin/officers",
            form,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          res.data.msg
        );

        setForm({
          name: "",
          email: "",
          phone: "",
          department: "",
          rank: "",
        });

        fetchOfficers();

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.msg ||
          "Failed to add officer"
        );

      } finally {

        setLoading(false);
      }
    };

  /* DELETE OFFICER */

  const deleteOfficer =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete officer?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await API.delete(
          `/api/admin/officers/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Officer deleted"
        );

        fetchOfficers();

      } catch (err) {

        console.log(err);

        alert(
          "Delete failed"
        );
      }
    };

  return (

    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
      }}
    >

      <h1
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        👮 Officers Management
      </h1>

      {/* ADD OFFICER FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        style={{
          background:
            "rgba(255,255,255,0.1)",

          backdropFilter:
            "blur(10px)",

          padding:
            "25px",

          borderRadius:
            "20px",

          marginBottom:
            "35px",

          display: "grid",

          gap: "15px",

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.3)",
        }}
      >

        <input
          type="text"
          name="name"
          placeholder="Officer Name"
          value={form.name}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Officer Email"
          value={form.email}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={
            form.department
          }
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="rank"
          placeholder="Rank"
          value={form.rank}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={
            buttonStyle
          }
        >
          {
            loading
              ? "Adding..."
              : "Add Officer"
          }
        </button>

      </form>

      {/* OFFICERS LIST */}

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >

        {officers.length === 0 && (

          <div
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            No officers found
          </div>
        )}

        {officers.map(
          (officer) => (

            <div
              key={
                officer._id
              }
              style={{
                background:
                  "rgba(255,255,255,0.12)",

                backdropFilter:
                  "blur(10px)",

                padding:
                  "25px",

                borderRadius:
                  "18px",

                color: "#fff",

                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.3)",
              }}
            >

              <h2
                style={{
                  fontSize:
                    "26px",

                  fontWeight:
                    "700",

                  marginBottom:
                    "14px",
                }}
              >
                {
                  officer.name
                }
              </h2>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {
                  officer.email
                }
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {
                  officer.phone
                }
              </p>

              <p>
                <strong>
                  Department:
                </strong>{" "}
                {
                  officer.department
                }
              </p>

              <p>
                <strong>
                  Rank:
                </strong>{" "}
                {
                  officer.rank
                }
              </p>

              <button
                onClick={() =>
                  deleteOfficer(
                    officer._id
                  )
                }
                style={{
                  marginTop:
                    "18px",

                  background:
                    "#ef4444",

                  color: "#fff",

                  border: "none",

                  padding:
                    "12px 16px",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "600",
                }}
              >
                Delete Officer
              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}

const inputStyle = {

  padding:
    "14px",

  border:
    "none",

  borderRadius:
    "10px",

  fontSize:
    "15px",

  outline:
    "none",

  background:
    "rgba(255,255,255,0.9)",
};

const buttonStyle = {

  background:
    "#2563eb",

  color: "#fff",

  border: "none",

  padding:
    "14px",

  borderRadius:
    "10px",

  cursor:
    "pointer",

  fontWeight:
    "700",

  fontSize:
    "16px",

  transition:
    "0.3s",
};