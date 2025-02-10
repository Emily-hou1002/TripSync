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

    // City-specific attractions and activities
    const cityAttractions = {
        'Paris': {
            landmarks: [
                "Eiffel Tower",
                "Louvre Museum",
                "Notre-Dame Cathedral",
                "Arc de Triomphe",
                "Palace of Versailles",
                "Sacré-Cœur",
                "Musée d'Orsay",
                "Champs-Élysées"
            ],
            restaurants: [
                "Le Marais district for authentic French cuisine",
                "Montmartre's charming cafés",
                "Latin Quarter bistros",
                "Saint-Germain-des-Prés brasseries",
                "Le Bouillon Chartier historic restaurant",
                "Rue Cler food street"
            ],
            activities: [
                "Seine River cruise",
                "Luxembourg Gardens stroll",
                "Tuileries Garden picnic",
                "Shopping at Galeries Lafayette",
                "Wine tasting in a local cave",
                "Sunset at Trocadéro"
            ]
        }
        // Add more cities as needed
    };

    const defaultAttractions = {
        landmarks: [`Visit ${location}'s main attractions`],
        restaurants: [`Try local cuisine in ${location}`],
        activities: [`Evening entertainment in ${location}`]
    };

    const cityData = cityAttractions[location] || defaultAttractions;

    // Generate varied daily schedules
    const dailySchedule = [];
    for (let i = 0; i < travelDays; i++) {
        const morning = cityData.landmarks[i % cityData.landmarks.length];
        const afternoon = cityData.restaurants[i % cityData.restaurants.length];
        const evening = cityData.activities[i % cityData.activities.length];

        dailySchedule.push([
            `Morning: Visit ${morning}`,
            `Afternoon: Enjoy ${afternoon}`,
            `Evening: Experience ${evening}`
        ]);
    }

    res.json({ dailySchedule });
});


// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
