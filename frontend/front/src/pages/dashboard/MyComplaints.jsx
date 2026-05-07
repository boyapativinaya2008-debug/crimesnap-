import { useNavigate } from "react-router-dom";
import "../../styles/mycomplaints.css";
import bg from "../../assets/auth-bg.jpeg";

export default function MyComplaints() {
  const navigate = useNavigate();

  const complaints = [
    { id: 1, title: "Theft in Street", category: "Crime", location: "Nellore", status: "Pending", description: "Mobile stolen at night near bus stop." },
    { id: 2, title: "Road Damage", category: "Infrastructure", location: "Main Road", status: "In Progress", description: "Big potholes causing accidents." },
    { id: 3, title: "Harassment Case", category: "Crime", location: "Bus Stand", status: "Resolved", description: "Issue resolved by police team." }
  ];

  const openDetails = (item) => {
    navigate("/complaint-details", { state: item });
  };

  return (
    <div className="mycomplaints-container" style={{ backgroundImage: `url(${bg})` }}>

      <div className="overlay"></div>

      <div className="mycomplaints-box">

        <h2>📄 My Complaints</h2>

        <div className="list-header">
          <span>Title</span>
          <span>Category</span>
          <span>Location</span>
          <span>Status</span>
        </div>

        {complaints.map((item) => (
          <div
            className="list-row clickable"
            key={item.id}
            onClick={() => openDetails(item)}
          >
            <span>{item.title}</span>
            <span>{item.category}</span>
            <span>{item.location}</span>
            <span className={`status ${item.status.toLowerCase().replace(" ", "")}`}>
              {item.status}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}