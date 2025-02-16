// controllers/itineraryController.js
const { readData, writeData } = require('../utils/db');
const { getDistanceMatrix } = require('../utils/googleApi');
const { getRecommendations } = require('../utils/foursquareApi');

/**
 * Helper function to optimize the order of places using the provided distance matrix.
 * Uses a nearest neighbor algorithm starting at the first place.
 *
 * @param {string[]} places - Array of place names or addresses.
 * @param {Object} distanceData - The distance matrix data returned from the Google API.
 * @returns {string[]} - The optimized ordering of places.
 */
function optimizeRouteWithDistanceData(places, distanceData) {
  const n = places.length;
  const visited = new Array(n).fill(false);
  const routeIndices = [];
  
  // Start at the first place (index 0)
  let currentIndex = 0;
  routeIndices.push(currentIndex);
  visited[currentIndex] = true;
  
  for (let count = 1; count < n; count++) {
    let nearestIndex = -1;
    let minDistance = Infinity;
    
    for (let j = 0; j < n; j++) {
      if (!visited[j]) {
        // Each element contains the distance from the current place to place j
        const element = distanceData.rows[currentIndex].elements[j];
        // Make sure the distance element is valid
        if (element.status === "OK") {
          const distance = element.distance.value;
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = j;
          }
        }
      }
    }
    
    if (nearestIndex === -1) break; // If no unvisited neighbor is found, break out
    routeIndices.push(nearestIndex);
    visited[nearestIndex] = true;
    currentIndex = nearestIndex;
  }
  
  // Convert indices back to the corresponding place names/addresses
  return routeIndices.map(index => places[index]);
}

/**
 * Helper function to split a route into daily schedules.
 *
 * @param {string[]} route - The optimized route of places.
 * @param {number} days - The number of days for the itinerary.
 * @returns {Array[]} - An array where each element is an array of places for that day.
 */
function splitRouteIntoDays(route, days) {
  const schedule = [];
  const n = route.length;
  const placesPerDay = Math.ceil(n / days);
  
  for (let i = 0; i < days; i++) {
    schedule.push(route.slice(i * placesPerDay, (i + 1) * placesPerDay));
  }
  
  return schedule;
}

/**
 * Get all itineraries from the JSON database.
 */
exports.getAllItineraries = async (req, res, next) => {
  try {
    const itineraries = await readData();
    res.json(itineraries);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single itinerary by its ID.
 */
exports.getItineraryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const itineraries = await readData();
    const itinerary = itineraries.find(item => item.id === id);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new itinerary.
 * Expects a request body with: { city, date, days, places (optional), finalPlan (optional) }
 */
exports.createItinerary = async (req, res, next) => {
  try {
    const { city, date, days, places, finalPlan } = req.body;
    
    // Validate required fields
    if (!city || !date || !days) {
      return res.status(400).json({ message: 'City, date, and number of days are required.' });
    }
    
    let optimizedRoute = [];
    let distanceData = null;
    
    if (places && places.length > 1) {
      // Calculate the distance matrix for the given places
      distanceData = await getDistanceMatrix(places, places);
      
      // Use the distance matrix to optimize the route using a nearest neighbor algorithm
      optimizedRoute = optimizeRouteWithDistanceData(places, distanceData);
    } else {
      // If only one (or no) place is provided, no optimization is needed
      optimizedRoute = places || [];
    }
    
    // Create a daily schedule by splitting the optimized route into subarrays for each day
    const dailySchedule = splitRouteIntoDays(optimizedRoute, days);
    
    // Get Foursquare recommendations for additional attractions in the city (optional)
    let recommendations = [];
    if (city) {
      recommendations = await getRecommendations(city, 'attraction');
    }
    
    // Create the new itinerary object.
    const newItinerary = {
      id: Date.now(),
      city,
      date,
      days,
      // Store the optimized order in the "places" field
      places: optimizedRoute,
      finalPlan: finalPlan || {},
      dailySchedule,
      // Optionally store additional data from API calls
      distanceData,
      recommendations,
    };
    
    // Read the current itineraries, add the new one, then write back to the JSON file.
    const itineraries = await readData();
    itineraries.push(newItinerary);
    await writeData(itineraries);
    
    res.status(201).json(newItinerary);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing itinerary.
 */
exports.updateItinerary = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const itineraries = await readData();
    const index = itineraries.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    // Merge existing itinerary data with the updates from the request body.
    const updatedItinerary = { ...itineraries[index], ...req.body };
    itineraries[index] = updatedItinerary;
    
    await writeData(itineraries);
    res.json(updatedItinerary);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an itinerary.
 */
exports.deleteItinerary = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    let itineraries = await readData();
    const index = itineraries.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    itineraries.splice(index, 1);
    await writeData(itineraries);
    res.json({ message: 'Itinerary deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
