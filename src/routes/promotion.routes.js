const express = require('express');
const router = express.Router();
const Promotion = require('../models/promotion.model');
const { auth, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all active promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Promotion not found
 */
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
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
 *               - startDate
 *               - endDate
 *               - discountPercentage
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               discountPercentage:
 *                 type: number
 *               conditions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Promotion created successfully
 */
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    const savedPromotion = await promotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               discountPercentage:
 *                 type: number
 *               conditions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 */
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
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
 *         description: Promotion deleted successfully
 */
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 