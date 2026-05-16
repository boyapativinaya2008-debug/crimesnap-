import {
  useEffect,
  useState,
} from "react";

import API from "../../api/api";

export default function AdminOfficers() {

  const [
    officers,
    setOfficers,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    badgeNo: "",
    rank: "",
    station: "",
    phone: "",
    email: "",
    password: "",
  });

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  /* =========================
     FETCH OFFICERS
  ========================= */

  const fetchOfficers =
    async () => {

      try {

        // ✅ UPDATED API

        const res =
          await API.get(
            "/admin/officers"
          );

        setOfficers(
          res.data
        );

      } catch (err) {

        console.error(
          "Fetch officers error:",
          err
        );
      }
    };

  useEffect(() => {

    fetchOfficers();

  }, []);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (
    e
  ) => {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (editingId) {

          // ✅ UPDATE

          await API.put(
            `/admin/officers/${editingId}`,
            form
          );

          alert(
            "Officer updated successfully"
          );

        } else {

          // ✅ ADD

          await API.post(
            "/admin/officers",
            form
          );

          alert(
            "Officer added successfully"
          );
        }

        setForm({
          name: "",
          badgeNo: "",
          rank: "",
          station: "",
          phone: "",
          email: "",
          password: "",
        });

        setEditingId(
          null
        );

        fetchOfficers();

      } catch (err) {

        console.error(
          "Submit error:",
          err
        );

        alert(
          err.response?.data
            ?.message ||
            "Something went wrong"
        );
      }
    };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (
    officer
  ) => {

    setEditingId(
      officer._id
    );

    setForm({
      name:
        officer.name || "",

      badgeNo:
        officer.badgeNo ||
        "",

      rank:
        officer.rank || "",

      station:
        officer.station ||
        "",

      phone:
        officer.phone || "",

      email:
        officer.email || "",

      password:
        officer.password ||
        "",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this officer?"
        );

      if (!confirmDelete)
        return;

      try {

        // ✅ UPDATED API

        await API.delete(
          `/admin/officers/${id}`
        );

        alert(
          "Officer deleted successfully"
        );

        fetchOfficers();

      } catch (err) {

        console.error(
          "Delete error:",
          err
        );

        alert(
          "Failed to delete officer"
        );
      }
    };

  return (

    <div
      style={{
        padding: "20px",
      }}
    >

      <h2>
        Officers Management
      </h2>

      {/* =========================
         FORM
      ========================= */}

      <form
        onSubmit={
          handleSubmit
        }
        style={{
          display:
            "grid",

          gap: "10px",

          maxWidth:
            "500px",

          marginBottom:
            "30px",
        }}
      >

        <input
          type="text"
          name="name"
          placeholder="Officer Name"
          value={form.name}
          onChange={
            handleChange
          }
          required
        />

        <input
          type="text"
          name="badgeNo"
          placeholder="Badge Number"
          value={
            form.badgeNo
          }
          onChange={
            handleChange
          }
          required
        />

        <input
          type="text"
          name="rank"
          placeholder="Rank"
          value={form.rank}
          onChange={
            handleChange
          }
          required
        />

        <input
          type="text"
          name="station"
          placeholder="Station"
          value={
            form.station
          }
          onChange={
            handleChange
          }
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={
            handleChange
          }
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={
            handleChange
          }
          required
        />

        {/* ✅ PASSWORD */}

        <input
          type="text"
          name="password"
          placeholder="Password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
          required
        />

        <button
          type="submit"
        >

          {editingId
            ? "Update Officer"
            : "Add Officer"}

        </button>

      </form>

      {/* =========================
         TABLE
      ========================= */}

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >

        <thead>

          <tr>

            <th>
              Name
            </th>

            <th>
              Badge No
            </th>

            <th>
              Rank
            </th>

            <th>
              Station
            </th>

            <th>
              Phone
            </th>

            <th>
              Email
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {officers.length ===
          0 ? (

            <tr>

              <td
                colSpan="7"
                align="center"
              >
                No officers
                found
              </td>

            </tr>

          ) : (

            officers.map(
              (
                officer
              ) => (

                <tr
                  key={
                    officer._id
                  }
                >

                  <td>
                    {
                      officer.name
                    }
                  </td>

                  <td>
                    {
                      officer.badgeNo
                    }
                  </td>

                  <td>
                    {
                      officer.rank
                    }
                  </td>

                  <td>
                    {
                      officer.station
                    }
                  </td>

                  <td>
                    {
                      officer.phone
                    }
                  </td>

                  <td>
                    {
                      officer.email
                    }
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        handleEdit(
                          officer
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          officer._id
                        )
                      }
                      style={{
                        marginLeft:
                          "10px",
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </table>

    </div>
  );
}