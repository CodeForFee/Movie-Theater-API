const { SCORE_PERCENTAGE } = require('./constants');

// Calculate score earned from booking
const calculateScoreEarned = (amount) => {
  return Math.floor(amount * SCORE_PERCENTAGE);
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Format time to HH:mm
const formatTime = (time) => {
  return time.toString().padStart(5, '0');
};

// Check if date is valid
const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Check if time is valid (HH:mm format)
const isValidTime = (time) => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

// Generate random seat number
const generateSeatNumber = (row, column) => {
  return `${row}${column.toString().padStart(2, '0')}`;
};

module.exports = {
  calculateScoreEarned,
  formatDate,
  formatTime,
  isValidDate,
  isValidTime,
  generateSeatNumber
}; 