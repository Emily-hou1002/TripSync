import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Itinerary.css";

const Itinerary = () => {
  const location = useLocation();
  console.log("Itinerary state:", location.state);
  const navigate = useNavigate();
  
  const tripData = location.state?.tripData || {};
  const itinerary = location.state?.itinerary || [];

  return (
    <div className="itinerary-container">
      <h1>Your Trip to {tripData.location} 📅</h1>

      <div className="itinerary-info">
        <p><strong>Travel Date:</strong> {tripData.travelDate ? new Date(tripData.travelDate).toLocaleDateString() : "N/A"}</p>
        <p><strong>Duration:</strong> {tripData.travelDays} days</p>
        <p><strong>End Date:</strong> {tripData.endDate || "N/A"}</p>
      </div>

      {itinerary.length > 0 ? (
        <div className="itinerary-details">
          <h2>Itinerary:</h2>
          {itinerary.map((day, index) => (
            <div key={index} className="day">
              <h3>Day {index + 1}</h3>
              <ul>
                {day.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No itinerary data available.</p>
      )}

      <button onClick={() => navigate("/")}>Back to Home 🏠</button>
    </div>
  );
};

export default Itinerary;
