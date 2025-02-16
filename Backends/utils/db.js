// utils/db.js
const fs = require('fs').promises;
const path = require('path');

// Define the path to your JSON "database"
// (Make sure data.json is located in your project's root directory)
const dataPath = path.join(__dirname, '../data.json');

/**
 * Reads the data from data.json.
 * If the file doesn't exist, returns an empty array.
 */
async function readData() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    } else {
      throw error;
    }
  }
}

/**
 * Writes the given data (object/array) to data.json.
 */
async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
