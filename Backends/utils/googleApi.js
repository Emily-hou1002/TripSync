// utils/googleApi.js
const axios = require('axios');

/**
 * Retrieves a distance matrix using the Google Distance Matrix API.
 * @param {string[]} origins - An array of origin addresses or coordinates.
 * @param {string[]} destinations - An array of destination addresses or coordinates.
 * @returns {Promise<Object>} - The API response data.
 */
async function getDistanceMatrix(origins, destinations) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

  try {
    const response = await axios.get(url, {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        key: apiKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching distance matrix: ' + error.message);
  }
}

module.exports = { getDistanceMatrix };
