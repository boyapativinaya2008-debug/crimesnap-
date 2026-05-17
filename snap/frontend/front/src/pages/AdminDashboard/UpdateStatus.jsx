import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import API from "../../api/api";

import "../../styles/updateStatus.css";

export default function UpdateStatus() {

  const [
    complaints,
    setComplaints,
  ] = useState([]);

  const [
    officers,
    setOfficers,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    fetchComplaints();

    fetchOfficers();

  }, []);

  /* ================= FETCH COMPLAINTS ================= */

  const fetchComplaints =
    async () => {

      try {

        const res =
          await API.get(
            "/admin/complaints"
          );

        setComplaints(
          res.data
        );

      } catch (err) {

        console.log(
          "Complaint fetch error:",
          err
        );
      }
    };

  /* ================= FETCH OFFICERS ================= */

  const fetchOfficers =
    async () => {

      try {

        // ✅ FIXED URL

        const res =
          await API.get(
            "/admin/officers"
          );

        setOfficers(
          res.data
        );

      } catch (err) {

        console.log(
          "Officer fetch error:",
          err
        );
      }
    };

  /* ================= UPDATE STATUS ================= */

  const handleStatusUpdate =
    async (
      id,
      status
    ) => {

      try {

        await API.put(
          `/admin/update-status/${id}`,
          { status }
        );

        setComplaints(
          (prev) =>
            prev.map(
              (item) =>
                item._id === id
                  ? {
                      ...item,
                      status,
                    }
                  : item
            )
        );

      } catch (err) {

        console.log(
          "Status update error:",
          err
        );
      }
    };

  /* ================= ASSIGN OFFICER ================= */

  const handleOfficerAssign =
    async (
      id,
      officerName
    ) => {

      try {

        // ✅ FIXED API

        await API.put(
          `/admin/assign/${id}`,
          {
            assignedOfficer:
              officerName,
          }
        );

        setComplaints(
          (prev) =>
            prev.map(
              (item) =>
                item._id === id
                  ? {
                      ...item,
                      assignedOfficer:
                        officerName,
                    }
                  : item
            )
        );

      } catch (err) {

        console.log(
          "Assign officer error:",
          err
        );
      }
    };

  /* ================= SEARCH FILTER ================= */

  const filteredComplaints =
    complaints.filter(
      (item) => {

        const keyword =
          search.toLowerCase();

        return (

          item.title
            ?.toLowerCase()
            .includes(
              keyword
            ) ||

          item.category
            ?.toLowerCase()
            .includes(
              keyword
            ) ||

          item.status
            ?.toLowerCase()
            .includes(
              keyword
            ) ||

          item.user?.name
            ?.toLowerCase()
            .includes(
              keyword
            )
        );
      }
    );

  return (

    <div className="update-page">

      {/* HEADER */}

      <div className="update-header">

        <div>

          <h1>
            🔄 Update Complaint
            Status
          </h1>

          <p>
            Manage and update
            complaint progress.
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div
        style={{
          marginBottom:
            "20px",
        }}
      >

        <input
          type="text"
          placeholder="Search by user, title, category, status..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            padding:
              "10px 14px",

            width: "100%",

            maxWidth:
              "400px",

            borderRadius:
              "8px",

            border:
              "1px solid #ccc",
          }}
        />

      </div>

      {/* TABLE */}

      <div className="update-table-wrapper">

        <table className="update-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>User</th>


              <th>Category</th>
              <th>Location</th>

              <th>Status</th>

              <th>Update</th>

              <th>
                Assigned Officer
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.length ===
            0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  No results found
                </td>

              </tr>

            ) : (

              filteredComplaints.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={item._id}
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {
                        item.user
                          ?.name
                      }
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>
                      {
                        item.location
                          
                      }
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status ${item.status}`}
                      >
                        {
                          item.status
                        }
                      </span>

                    </td>

                    {/* UPDATE STATUS */}

                    <td>

                      <select
                        value={
                          item.status
                        }
                        onChange={(
                          e
                        ) =>
                          handleStatusUpdate(
                            item._id,
                            e.target
                              .value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>

                    </td>

                    {/* ASSIGN OFFICER */}

                    <td>

                      <select
                        value={
                          item.assignedOfficer ||
                          ""
                        }
                        onChange={(
                          e
                        ) =>
                          handleOfficerAssign(
                            item._id,
                            e.target
                              .value
                          )
                        }
                      >

                        <option value="">
                          Select Officer
                        </option>

                        {officers.map(
                          (
                            officer
                          ) => (

                            <option
                              key={
                                officer._id
                              }
                              value={
                                officer.name
                              }
                            >
                              {
                                officer.name
                              }
                            </option>

                          )
                        )}

                      </select>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}