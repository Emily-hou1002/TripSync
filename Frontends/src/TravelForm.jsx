import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TravelForm.css";

const TravelForm = () => {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [days, setDays] = useState("");
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  // Calculates the end date based on the start date and number of days
  const calculateEndDate = (start, days) => {
    if (start && days > 0) {
      const endDateObj = new Date(start);
      endDateObj.setDate(endDateObj.getDate() + parseInt(days));
      return endDateObj;
    }
    return null;
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(calculateEndDate(date, days));
  };

  // Handle number of days change
  const handleNumDaysChange = (e) => {
    const newNumDays = parseInt(e.target.value) || 0;
    if (newNumDays > 0) {
      setDays(newNumDays);
      setEndDate(calculateEndDate(startDate, newNumDays));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !startDate || !days) {
      alert("Please fill out all fields before confirming your trip.");
      return;
    }

    const tripData = {
      location: city,
      travelDate: startDate.toISOString(),
      travelDays: days,
      endDate: endDate.toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/generateItinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const itinerary = responseData.itinerary; // Get itinerary data from the response
        // Pass both tripData and itinerary to the next page
        navigate("/itinerary", { state: { tripData, itinerary } });
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="trip-container">
      <h1>Plan Your Trip 🗺️</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>🏙️ Destination City:</label>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>📅 Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="MMM dd, yyyy"
            placeholderText="Select a start date"
            required
          />
        </div>

        <div className="form-group">
          <label>⏳ Number of Days to Stay:</label>
          <input
            type="number"
            placeholder="Enter number of days"
            min="1"
            value={days}
            onChange={handleNumDaysChange}
            required
          />
        </div>

        <div className="form-group">
          <label>📅 End Date:</label>
          <div id="end-date">
            {endDate ? endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
          </div>
        </div>

        <button type="submit">Confirm Trip 🚀</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>⬅️ Back to Home</button>
    </div>
  );
};

export default TravelForm;
