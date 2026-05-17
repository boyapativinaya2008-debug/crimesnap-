
import { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/adminreports.css";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    area: "",
    city: "",
    state: "Andhra Pradesh",
    pincode: "",
  });

  const fetchLocations = async () => {
    try {
      const res = await API.get("/admin/locations");
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin/locations", form);

      alert("Location Added Successfully");

      setForm({
        area: "",
        city: "",
        state: "Andhra Pradesh",
        pincode: "",
      });

      fetchLocations();
    } catch (err) {
      console.error(err);
      alert("Failed to add location");
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Locations</h1>

      <form
        onSubmit={handleSubmit}
        className="add-location-form"
        style={{
          marginBottom: "20px",
          display: "grid",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="area"
          placeholder="Area Name"
          value={form.area}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />

        <button type="submit" className="add-btn">
          Add Location
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Area</th>
            <th>City</th>
            <th>State</th>
            <th>Pincode</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((location, index) => (
            <tr key={location._id}>
              <td>{index + 1}</td>
              <td>{location.area}</td>
              <td>{location.city}</td>
              <td>{location.state}</td>
              <td>{location.pincode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
