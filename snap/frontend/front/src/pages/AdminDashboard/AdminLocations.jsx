import { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/adminlocations.css";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    stationName: "",
    area: "",
    city: "",
    district: "",
    state: "Andhra Pradesh",
    pincode: "",
  });

  /* ================= FETCH ================= */
  const fetchLocations = async () => {
    const res = await API.get("/admin/locations");
    setLocations(res.data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT (CREATE / UPDATE) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`/admin/locations/${editingId}`, form);
      setEditingId(null);
    } else {
      await API.post("/admin/locations", form);
    }

    setForm({
      stationName: "",
      area: "",
      city: "",
      district: "",
      state: "Andhra Pradesh",
      pincode: "",
    });

    fetchLocations();
  };

  /* ================= DELETE ================= */
  const deleteLocation = async (id) => {
    if (!window.confirm("Delete this location?")) return;

    await API.delete(`/admin/locations/${id}`);
    fetchLocations();
  };

  /* ================= EDIT ================= */
  const editLocation = (loc) => {
    setForm(loc);
    setEditingId(loc._id);
  };

  return (
    <div className="admin-locations-page">

      <h1>Locations</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form">

        <input name="stationName" placeholder="Station Name" value={form.stationName} onChange={handleChange} required />
        <input name="area" placeholder="Area" value={form.area} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="district" placeholder="District" value={form.district} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />

        <button type="submit">
          {editingId ? "Update Location" : "Add Location"}
        </button>
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Station</th>
            <th>Area</th>
            <th>City</th>
            <th>District</th>
            <th>Pincode</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((loc) => (
            <tr key={loc._id}>
              <td>{loc.stationName}</td>
              <td>{loc.area}</td>
              <td>{loc.city}</td>
              <td>{loc.district}</td>
              <td>{loc.pincode}</td>

              <td>
                <button onClick={() => editLocation(loc)}>Edit</button>
                <button onClick={() => deleteLocation(loc._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}