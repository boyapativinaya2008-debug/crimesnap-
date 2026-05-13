import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../../styles/adminreports.css";

export default function Admindbhome() {

  const [stats, setStats] = useState({
    reports: 0,
    users: 0,
    officers: 0,
    locations: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {

    const fetchDashboardData = async () => {

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

        const complaints = res.data;

        // UNIQUE USERS
        const uniqueUsers = new Set();

        // UNIQUE LOCATIONS
        const uniqueLocations = new Set();

        // CATEGORY COUNT
        const categoryCount = {};

        complaints.forEach((item) => {

          if (item.user?.email) {
            uniqueUsers.add(item.user.email);
          }

          if (item.location) {
            uniqueLocations.add(item.location);
          }

          const category = item.category || "Other";

          categoryCount[category] =
            (categoryCount[category] || 0) + 1;

        });

        setStats({
          reports: complaints.length,
          users: uniqueUsers.size,
          officers: 5,
          locations: uniqueLocations.size,
        });

        // BAR CHART DATA
        setChartData([
          {
            name: "Reports",
            value: complaints.length,
          },
          {
            name: "Users",
            value: uniqueUsers.size,
          },
          {
            name: "Officers",
            value: 5,
          },
          {
            name: "Locations",
            value: uniqueLocations.size,
          },
        ]);

        // PIE CHART DATA
        const pieData = Object.keys(categoryCount).map((key) => ({
          name: key,
          value: categoryCount[key],
        }));

        setCategoryData(pieData);

      } catch (err) {

        console.log(err);

      }
    };

    fetchDashboardData();

  }, []);

  const cards = [
    {
      title: "Total Reports",
      value: stats.reports,
    },
    {
      title: "Users",
      value: stats.users,
    },
    {
      title: "Officers",
      value: stats.officers,
    },
    {
      title: "Locations",
      value: stats.locations,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
  ];

  return (
    <div className="admin-page">

      <h1>Admin Dashboard</h1>

      {/* CARDS */}
      <div className="dashboard-cards">

        {cards.map((card, index) => (

          <div className="dashboard-card" key={index}>

            <h2>{card.value}</h2>
            <p>{card.title}</p>

          </div>

        ))}

      </div>


      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px",
        }}
      >


        {/* BAR CHART */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >

          <h2 style={{ marginBottom: "20px" }}>
            System Usage
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" fill="#2563eb" />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* PIE CHART */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >

          <h2 style={{ marginBottom: "20px" }}>
            Complaint Categories
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >

                {categoryData.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}
