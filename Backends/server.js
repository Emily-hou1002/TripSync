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
        },
        'New York': {
            landmarks: [
                "Statue of Liberty",
                "Times Square",
                "Central Park",
                "Empire State Building",
                "Brooklyn Bridge",
                "One World Observatory",
                "Rockefeller Center",
                "Grand Central Terminal"
            ],
            restaurants: [
                "Katz's Delicatessen for pastrami sandwiches",
                "Joe's Pizza for classic New York slices",
                "Le Bernardin for Michelin-starred seafood",
                "Shake Shack in Madison Square Park",
                "Eataly NYC for Italian cuisine",
                "Smorgasburg food market in Brooklyn"
            ],
            activities: [
                "Broadway show in Times Square",
                "Walk along The High Line",
                "Visit the MET Museum",
                "Boat ride to Ellis Island",
                "Explore Chelsea Market",
                "Night skyline view from Top of the Rock"
            ]
        },
        'Tokyo': {
            landmarks: [
                "Shibuya Crossing",
                "Tokyo Tower",
                "Senso-ji Temple",
                "Meiji Shrine",
                "Tsukiji Outer Market",
                "Akihabara Electric Town",
                "Ginza shopping district",
                "Odaiba futuristic island"
            ],
            restaurants: [
                "Sukiyabashi Jiro for sushi",
                "Ippudo Ramen in Shinjuku",
                "Yakitori Alley in Yurakucho",
                "Tonkatsu Maisen for pork cutlet",
                "Tsukiji Outer Market for fresh seafood",
                "Ningyocho Imahan for sukiyaki"
            ],
            activities: [
                "Cherry blossom viewing in Ueno Park",
                "Shopping in Harajuku's Takeshita Street",
                "Sumo wrestling match in Ryogoku",
                "Robot Show in Shinjuku",
                "Day trip to Mount Fuji",
                "Anime pilgrimage in Akihabara"
            ]
        },
        'London': {
            landmarks: [
                "Big Ben & Houses of Parliament",
                "Tower of London",
                "Buckingham Palace",
                "London Eye",
                "St. Paul's Cathedral",
                "Trafalgar Square",
                "Westminster Abbey",
                "British Museum"
            ],
            restaurants: [
                "Sketch London for afternoon tea",
                "Dishoom for Indian cuisine",
                "The Ledbury for fine dining",
                "Borough Market for street food",
                "Duck & Waffle for skyline views",
                "Chinatown for authentic Asian food"
            ],
            activities: [
                "Thames River cruise",
                "West End theater show",
                "Walk through Hyde Park",
                "Shopping at Harrods & Oxford Street",
                "Ride the Tube and explore Camden Market",
                "Day trip to Windsor Castle"
            ]
        },
        'Vancouver': {
            landmarks: [
                "Stanley Park",
                "Capilano Suspension Bridge",
                "Grouse Mountain",
                "Granville Island",
                "Gastown Steam Clock",
                "Vancouver Art Gallery",
                "Science World",
                "Lions Gate Bridge"
            ],
            restaurants: [
                "Miku for sushi with waterfront views",
                "The Flying Pig for Canadian comfort food",
                "Japadog food truck for Japanese hotdogs",
                "Salmon n' Bannock for Indigenous cuisine",
                "Dinesty Dumpling House for dim sum",
                "Nightingale for farm-to-table dishes"
            ],
            activities: [
                "Cycling around Stanley Park",
                "Skiing or hiking on Grouse Mountain",
                "Sunset at English Bay Beach",
                "Kayaking in Deep Cove",
                "Whale watching in the Pacific Ocean",
                "Exploring Capilano Suspension Bridge Park"
            ]
        }
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
