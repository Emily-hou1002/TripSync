// utils/foursquareApi.js
const axios = require('axios');

/**
 * Retrieves recommended places using the Foursquare API (v3) with API key authentication.
 * @param {string} location - The location (e.g., city or coordinates).
 * @param {string} query - The search query (e.g., "coffee", "museum").
 * @returns {Promise<Object[]>} - An array of recommended venues.
 */
async function getRecommendations(location, query) {
  const apiKey = process.env.FOURSQUARE_API_KEY; // Use API key instead of client id/secret
  const url = 'https://api.foursquare.com/v3/places/search';

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': apiKey, // Pass API key in the Authorization header
      },
      params: {
        near: location,
        query: query,
        // You can add more parameters as needed per Foursquare API documentation
      },
    });
    // For Foursquare v3, the recommended places are usually in response.data.results.
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching recommendations from Foursquare: ' + error.message);
  }
}

module.exports = { getRecommendations };

