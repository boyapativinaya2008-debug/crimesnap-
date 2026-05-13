// src/pages/AdminDashboard/AdminLocations.jsx

import {
  useEffect,
  useState,
} from "react";

import API from "../../api/api";

export default function AdminLocations() {

  const [locations, setLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      area: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    });

  useEffect(() => {
    fetchLocations();
  }, []);

  /* FETCH LOCATIONS */

  const fetchLocations =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(
            "/locations",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setLocations(
          res.data
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to fetch locations"
        );
      }
    };

  /* HANDLE INPUT */

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  /* ADD LOCATION */

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
            "/locations",
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
          area: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        });

        fetchLocations();

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.msg ||
          "Failed to add location"
        );

      } finally {

        setLoading(false);
      }
    };

  /* DELETE LOCATION */

  const deleteLocation =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete location?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await API.delete(
          `/locations/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Location deleted"
        );

        fetchLocations();

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
        📍 Locations Management
      </h1>

      {/* ADD LOCATION FORM */}

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
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={
            handleChange
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="district"
          placeholder="District"
          value={
            form.district
          }
          onChange={
            handleChange
          }
          style={inputStyle}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={
            handleChange
          }
          style={inputStyle}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={
            form.pincode
          }
          onChange={
            handleChange
          }
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
              : "Add Location"
          }
        </button>

      </form>

      {/* LOCATIONS LIST */}

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >

        {locations.length === 0 && (

          <div
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            No locations found
          </div>
        )}

        {locations.map(
          (location) => (

            <div
              key={
                location._id
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
                  location.area
                }
              </h2>

              <p>
                <strong>
                  City:
                </strong>{" "}
                {
                  location.city
                }
              </p>

              <p>
                <strong>
                  District:
                </strong>{" "}
                {
                  location.district
                }
              </p>

              <p>
                <strong>
                  State:
                </strong>{" "}
                {
                  location.state
                }
              </p>

              <p>
                <strong>
                  Pincode:
                </strong>{" "}
                {
                  location.pincode
                }
              </p>

              <button
                onClick={() =>
                  deleteLocation(
                    location._id
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
                Delete Location
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