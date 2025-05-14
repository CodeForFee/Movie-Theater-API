const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String
  }],
  posterUrl: {
    type: String
  },
  trailerUrl: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  showtimes: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 