// utils/helpers.js

/**
 * Format a date string into a more readable format.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  module.exports = { formatDate };

  