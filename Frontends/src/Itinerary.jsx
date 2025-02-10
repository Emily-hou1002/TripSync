import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Itinerary.css";

const Itinerary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripData = location.state;

  if (!tripData) {
    return <p style={{ color: "white" }}>No trip details found. Please go back and enter trip details.</p>;
  }

  return (
    <div className="itinerary-container">
      <h1>Your Itinerary 📍</h1>
      <div className="trip-details">
        <p><strong>Destination:</strong> {tripData.location}</p>
        <p><strong>Start Date:</strong> {new Date(tripData.travelDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {tripData.endDate}</p>
        <p><strong>Total Days:</strong> {tripData.travelDays} days</p>
      </div>
      <button onClick={() => navigate("/")}>🏠 Back to Home</button>
    </div>
  );
};

export default Itinerary;