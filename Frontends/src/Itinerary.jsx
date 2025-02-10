import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Itinerary.css";

const Itinerary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { tripData, itinerary } = state || {};

  return (
    <div className="itinerary-container">
      <h1>Your Trip to {tripData?.location} 📅</h1>

      <div className="itinerary-info">
        <p><strong>Travel Date:</strong> {new Date(tripData?.travelDate).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> {tripData?.travelDays} days</p>
        <p><strong>End Date:</strong> {new Date(tripData?.endDate).toLocaleDateString()}</p>
      </div>

      {itinerary && itinerary.length > 0 ? (
        <div className="itinerary-details">
          <h2>Itinerary:</h2>
          {/* Iterate over each day in the itinerary */}
          {itinerary.map((day, index) => (
            <div key={index} className="day">
              <h3>Day {index + 1}</h3>
              {/* Iterate over each spot group for the day */}
              {day.map((spotGroup, groupIndex) => (
                <div key={groupIndex} className="spot-group">
                  <h4>Group {groupIndex + 1}:</h4>
                  {/* Display the spots in the group */}
                  {spotGroup.map((spot, spotIndex) => (
                    <p key={spotIndex}>
                      <strong>{spot.name}</strong><br />
                      {spot.location.formatted_address} <br />
                      Rating: {spot.rating ? spot.rating : "N/A"}
                    </p>
                  ))}
                </div>
              ))}
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
