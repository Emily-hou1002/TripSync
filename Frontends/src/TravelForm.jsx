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
      endDateObj.setDate(endDateObj.getDate() + parseInt(days));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !startDate || !days) {
      alert("Please fill out all fields before confirming your trip.");
      return;
    }
  
    // Prepare data to send
    const tripData = {
      location: city, // Send the city name
      travelDate: startDate.toISOString(), // Convert start date to ISO string for backend
      travelDays: days, // Send the number of days
    };
  
    try {
      // Send data to backend via POST request to /generateItinerary endpoint
      const response = await fetch('http://localhost:3000/generateItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend we're sending JSON
        },
        body: JSON.stringify(tripData), // Convert the JavaScript object to a JSON string
      });
  
      // Check if the response is okay
      if (response.ok) {
        const responseData = await response.json();
        console.log('Itinerary generated:', responseData.itinerary);
        alert(`Your trip to ${city} has been planned!`);
        navigate("/"); // Navigate back to home page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the data.");
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
