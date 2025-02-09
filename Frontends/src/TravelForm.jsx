import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the datepicker
import "./TravelForm.css"; // Ensure this file exists for styling

const TravelForm = () => {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [days, setDays] = useState("");
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  // Function to calculate the end date
  const calculateEndDate = (start, days) => {
    if (start && days > 0) {
      const endDateObj = new Date(start);
      endDateObj.setDate(endDateObj.getDate() + parseInt(days) - 1);
      return endDateObj;
    }
    return null;
  };

  // Handle changes to the start date
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(calculateEndDate(date, days));
  };

  // Handle changes to the number of days
  const handleNumDaysChange = (e) => {
    const newNumDays = parseInt(e.target.value) || 0;
    if (newNumDays <= 0) return;
    setDays(newNumDays);
    setEndDate(calculateEndDate(startDate, newNumDays));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !startDate || !days) {
      alert("Please fill out all fields before confirming your trip.");
      return;
    }
    alert(`Trip planned to ${city} starting on ${startDate.toLocaleDateString("en-US")} for ${days} days!`);
    navigate("/");
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
