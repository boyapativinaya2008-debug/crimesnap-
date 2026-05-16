import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "../../styles/mycomplaints.css";

import bg from "../../assets/auth-bg.jpeg";

export default function MyComplaints() {

  const navigate =
    useNavigate();

  const [
    complaints,
    setComplaints,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    fetchComplaints();

  }, []);

  const fetchComplaints =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            "http://localhost:3000/api/complaints/my",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "Complaints:",
          res.data
        );

        setComplaints(
          res.data || []
        );

        setLoading(false);

      } catch (err) {

        console.log(
          "FETCH ERROR:",
          err
        );

        setLoading(false);
      }
    };

  const openDetails = (
    item
  ) => {

    navigate(
      "/complaint-details",
      {
        state: item,
      }
    );
  };

  return (

    <div
      className="mycomplaints-container"
      style={{
        backgroundImage:
          `url(${bg})`,
      }}
    >

      <div className="overlay"></div>

      <div className="mycomplaints-box">

        <h2>
          📄 My Complaints
        </h2>

        <p>
          View all complaints
          submitted by you
        </p>

        {/* ================= HEADER ================= */}

        <div className="list-header">

          <span>
            Title
          </span>

          <span>
            Category
          </span>

          <span>
            Location
          </span>

          <span>
            Status
          </span>

          <span>
            Assigned Officer
          </span>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (

          <p
            style={{
              marginTop:
                "20px",

              textAlign:
                "center",
            }}
          >
            Loading...
          </p>

        )}

        {/* ================= NO DATA ================= */}

        {!loading &&
          complaints.length ===
            0 && (

            <p
              style={{
                marginTop:
                  "20px",

                textAlign:
                  "center",
              }}
            >
              No complaints
              found
            </p>
          )}

        {/* ================= COMPLAINT LIST ================= */}

        {!loading &&
          complaints.length >
            0 &&
          complaints.map(
            (item) => (

              <div
                key={item._id}
                className="list-row clickable"
                onClick={() =>
                  openDetails(
                    item
                  )
                }
              >

                {/* TITLE */}

                <span>
                  {item.title}
                </span>

                {/* CATEGORY */}

                <span>
                  {
                    item.category
                  }
                </span>

                {/* LOCATION */}

                <span>
                  {
                    item.location
                  }
                </span>

                {/* STATUS */}

                <span
                  className={`status ${
                    item.status ===
                    "Pending"
                      ? "pending"
                      : item.status ===
                        "In Progress"
                      ? "inprogress"
                      : "resolved"
                  }`}
                >
                  {item.status}
                </span>

                {/* ASSIGNED OFFICER */}

                <span
                  className="officer-name"
                >

                  {item.assignedOfficer ||
                    "Not Assigned"}

                </span>

              </div>
            )
          )}

      </div>

    </div>
  );
}