import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/report.css";
import bg from "../../assets/auth-bg.jpeg";

export default function ReportComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/complaint-details", { state: form });
  };

  return (
    <div
      className="report-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="report-card">

        <h2>📢 Report Complaint</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option>Crime</option>
            <option>Theft</option>
            <option>Harassment</option>
            <option>Road Issue</option>
            <option>Electricity</option>
            <option>Water Problem</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Describe the issue..."
            value={form.description}
            onChange={handleChange}
          />

          {/* UPLOAD IMAGE */}
          <label className="upload-btn">
            📷 Upload Evidence
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          <button type="submit">🚀 Submit Complaint</button>

        </form>

      </div>

    </div>
  );
}