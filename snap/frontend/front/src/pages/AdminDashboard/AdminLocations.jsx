import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/adminreports.css";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🏁 Kept 'name' to align flawlessly with your backend req.body validation structure
  const [name, setName] = useState(""); 
  const [city, setCity] = useState("");
  const [state, setState] = useState("Andhra Pradesh");
  const [pincode, setPincode] = useState("");

  /* ================= FETCH LOCATIONS ================= */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/admin/locations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(res.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  /* ================= ADD LOCATION FUNCTION ================= */
  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Matches the destructuring assignment exactly: const { name, city, state, pincode } = req.body;
      const newLocation = {
        name: name.toLowerCase(), 
        city: city.toUpperCase(), 
        state,
        pincode
      };

      const response = await axios.post(
        "http://localhost:3000/api/admin/locations",
        newLocation,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Location Added Successfully!");

      // Optimistic UI state appending matching database properties
      const optimalAddedLocation = {
        _id: response.data.id, // Your backend response sends the ID explicitly as 'id'
        name: newLocation.name,
        city: newLocation.city,
        state: newLocation.state,
        pincode: newLocation.pincode
      };

      setLocations([optimalAddedLocation, ...locations]);

      // Reset standard input elements
      setName("");
      setCity("");
      setPincode("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Failed to add location");
    }
  };

  if (loading) return <h2>Loading location data...</h2>;

  return (
    <div className="admin-page">
      <h1>Crime Locations</h1>

      {/* ================= ADD LOCATION FORM ================= */}
      <form onSubmit={handleAddLocation} className="add-location-form" style={{ marginBottom: "25px", display: "grid", gap: "10px", maxWidth: "400px" }}>
        <h3>Add New Crime Location</h3>
        
        <input 
          type="text" 
          placeholder="Area Name" 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="City (e.g., ANANTHAPUR)" 
          required 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="State (e.g., Andhra Pradesh)" 
          required 
          value={state} 
          onChange={(e) => setState(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Pincode (e.g., 515110)" 
          required 
          value={pincode} 
          onChange={(e) => setPincode(e.target.value)} 
        />
        
        <button type="submit" className="add-btn">Save Location</button>
      </form>

      {/* ================= DATA TABLE ================= */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Location/Area</th>
            <th>City</th>
            <th>State</th>
            <th>Pincode</th>
          </tr>
        </thead>
        <tbody>
          {locations.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No location data found</td>
            </tr>
          ) : (
            locations.map((location, index) => (
              <tr key={location._id || location.id}>
                <td>{index + 1}</td> 
                {/* 🔀 Fallback: read 'name' first; if old record has 'area', display it instead of blank or N/A */}
                <td>{location.name || location.area || "N/A"}</td>
                <td>{location.city || "N/A"}</td>
                <td>{location.state || "N/A"}</td>
                <td>{location.pincode || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
