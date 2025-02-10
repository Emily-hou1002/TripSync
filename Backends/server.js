const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Loads environment variables

// Import route files
const itineraryRoutes = require("./routes/itineraryRoutes");
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors()); // Enables cross-origin requests
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use("/api/itineraries", itineraryRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Itinerary Planner API!");
});

// ✅ New Route for Generating an Itinerary (Fix for Frontend)
app.post("/generateItinerary", async (req, res) => {
    const { location, travelDate, travelDays } = req.body;

    if (!location || !travelDate || !travelDays) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Here, you could integrate logic to fetch places, optimize route, etc.
    const itinerary = {
        location,
        startDate: travelDate,
        duration: travelDays,
        message: "Your itinerary has been successfully created!"
    };

    console.log("Itinerary created:", itinerary);
    res.json({ success: true, itinerary });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
