import { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/adminofficers.css";

export default function AdminOfficers() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/officers");
      setOfficers(res.data);
    } catch (err) {
      console.error("Fetch officers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const getStatus = (active, max) => {
    const percent = max > 0 ? (active / max) * 100 : 0;

    if (percent >= 100) return "Busy";
    if (percent >= 70) return "Heavy";
    if (percent >= 30) return "Moderate";
    return "Free";
  };

  const getStyle = (status) => {
    switch (status) {
      case "Busy":
        return { background: "#fee2e2", color: "#991b1b" };
      case "Heavy":
        return { background: "#fef3c7", color: "#92400e" };
      case "Moderate":
        return { background: "#dbeafe", color: "#1e3a8a" };
      default:
        return { background: "#d1fae5", color: "#065f46" };
    }
  };

  return (
    <div className="admin-page">
      <h1>Officer Workload Dashboard</h1>

      {loading ? (
        <p>Loading officers...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Badge No</th>
              <th>Rank</th>
              <th>Station</th>
              <th>Workload</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {officers.map((officer) => {
              const active = officer.activeCases || 0;
              const max = officer.maxCapacity || 5;

              const load = `${active} / ${max}`;
              const status = getStatus(active, max);

              return (
                <tr key={officer._id}>
                  <td>{officer.name}</td>
                  <td>{officer.badgeNumber}</td>
                  <td>{officer.rank}</td>
                  <td>{officer.station}</td>

                  <td>
                    <strong>{load}</strong>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        ...getStyle(status),
                      }}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}