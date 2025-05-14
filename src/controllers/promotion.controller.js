const Promotion = require('../models/promotion.model');

// Get all active promotions
const getPromotions = async (req, res) => {
  try {
    const currentDate = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    res.json({
      success: true,
      data: promotions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get promotion by ID
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Promotion not found'
      });
    }
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new promotion
const createPromotion = async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    const savedPromotion = await promotion.save();
    res.status(201).json({
      success: true,
      data: savedPromotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update promotion
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Promotion not found'
      });
    }
    
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete promotion (soft delete)
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Promotion not found'
      });
    }
    
    res.json({
      success: true,
      data: { message: 'Promotion deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion
}; 