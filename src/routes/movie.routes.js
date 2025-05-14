const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.model');
const { auth, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all active movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - duration
 *               - releaseDate
 *               - genre
 *               - director
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *               genre:
 *                 type: string
 *               director:
 *                 type: string
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *               posterUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               showtimes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     time:
 *                       type: string
 *                     availableSeats:
 *                       type: number
 *     responses:
 *       201:
 *         description: Movie created successfully
 */
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *               genre:
 *                 type: string
 *               director:
 *                 type: string
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *               posterUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               showtimes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     time:
 *                       type: string
 *                     availableSeats:
 *                       type: number
 *     responses:
 *       200:
 *         description: Movie updated successfully
 */
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 