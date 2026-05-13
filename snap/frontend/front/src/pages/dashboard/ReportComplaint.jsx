import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles/report.css";
import bg from "../../assets/auth-bg.jpeg";
import "../../styles/dashboard.css";

export default function ReportComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: null
  });

  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean up the preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("⚠️ Please login first");
        setLoading(false);
        return;
      }

      if (!form.image) {
        setMessage("⚠️ Please upload evidence image");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("description", form.description);
      
      // FIXED: Name must match upload.single("image") in server.js
      formData.append("image", form.image); 

      await axios.post(
        "http://localhost:3000/api/complaints", // Ensure no trailing slash
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setLoading(false);
      setMessage("✅ Complaint submitted successfully!");

      setTimeout(() => {
        navigate("/dashboard/my-complaints");
      }, 1200);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage(err.response?.data?.msg || "❌ Failed to submit complaint");
    }
  };

  return (
    <div
      className="report-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="report-card">
        <h2>📢 Report Complaint</h2>

        {message && <div className="status-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Crime">Crime</option>
            <option value="Theft">Theft</option>
            <option value="Harassment">Harassment</option>
            <option value="Road Issue">Road Issue</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Problem">Water Problem</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Describe the issue..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <label className="upload-btn">
            📷 Upload Evidence
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="image-preview-box"
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "10px",
                maxHeight: "200px",
                objectFit: "cover"
              }}
            />
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "🚀 Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}