const express = require('express');
const router = express.Router();
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const { auth, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', auth, authorize('admin', 'employee'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username fullName email')
      .populate('movie', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/bookings/user:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 */
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie
 *               - showTime
 *               - seats
 *               - totalAmount
 *               - paymentMethod
 *             properties:
 *               movie:
 *                 type: string
 *               showTime:
 *                 type: string
 *                 format: date-time
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, score]
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', auth, async (req, res) => {
  try {
    const { movie, showTime, seats, totalAmount, paymentMethod } = req.body;
    
    // If using score for payment, check and update user's score
    if (paymentMethod === 'score') {
      const scoreNeeded = totalAmount; // Assuming 1 score = 1 currency unit
      if (req.user.score < scoreNeeded) {
        return res.status(400).json({ message: 'Insufficient score' });
      }
      
      // Update user's score
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { score: -scoreNeeded }
      });
    }

    const booking = new Booking({
      user: req.user._id,
      movie,
      showTime,
      seats,
      totalAmount,
      paymentMethod,
      scoreUsed: paymentMethod === 'score' ? totalAmount : 0
    });

    const savedBooking = await booking.save();
    
    // Add score for the booking
    const scoreEarned = Math.floor(totalAmount * 0.1); // 10% of total amount as score
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { score: scoreEarned }
    });
    
    savedBooking.scoreEarned = scoreEarned;
    await savedBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Booking updated successfully
 */
router.put('/:id', auth, authorize('admin', 'employee'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If booking is cancelled, refund the score if it was used
    if (req.body.status === 'cancelled' && booking.scoreUsed > 0) {
      await User.findByIdAndUpdate(booking.user, {
        $inc: { score: booking.scoreUsed }
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 