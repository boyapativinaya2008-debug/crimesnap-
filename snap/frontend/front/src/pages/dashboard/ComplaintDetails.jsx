import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/mycomplaints.css";
import bg from "../../assets/auth-bg.jpeg";

export default function ComplaintDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No Complaint Data</h2>;
  }

  return (
    <div
      className="mycomplaints-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="overlay"></div>

      <div className="mycomplaints-box">

        <h2>📌 Complaint Details</h2>

        <p><b>Title:</b> {state.title}</p>
        <p><b>Category:</b> {state.category}</p>
        <p><b>Location:</b> {state.location}</p>
        <p><b>Status:</b> Pending</p>
        <p><b>Description:</b> {state.description}</p>

        {/* IMAGE DISPLAY */}
        {state.image && (
          <img
            src={state.image}
            alt="evidence"
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "10px",
              border: "2px solid #00b4ff"
            }}
          />
        )}

        <button onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

      </div>

    </div>
  );
}