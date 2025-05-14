// User roles
const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MEMBER: 'member'
};

// Booking status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

// Payment methods
const PAYMENT_METHODS = {
  CASH: 'cash',
  SCORE: 'score'
};

// Score calculation
const SCORE_PERCENTAGE = 0.1; // 10% of booking amount

// JWT token expiration
const TOKEN_EXPIRATION = '24h';

module.exports = {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
  SCORE_PERCENTAGE,
  TOKEN_EXPIRATION
}; 