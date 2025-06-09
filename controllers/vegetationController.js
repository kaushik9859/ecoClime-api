const VegetationHealth = require('../models/VegetationHealth');
const { getVegetationHealth } = require('../services/vegetationService');

// @desc    Get vegetation health for location
// @route   POST /api/vegetation
// @access  Private
const analyzeVegetation = async (req, res) => {
  const { location } = req.body;
  const userLocation = location || req.user.location;

  if (!userLocation) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Get vegetation data from external API
    const vegetationData = await getVegetationHealth(userLocation);

    // Save to database
    const vegetationHealth = await VegetationHealth.create({
      user: req.user._id,
      location: userLocation,
      score: vegetationData.score,
      status: vegetationData.status,
      recommendation: vegetationData.recommendation,
    });

    res.status(201).json(vegetationHealth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's vegetation health history
// @route   GET /api/vegetation/history
// @access  Private
const getVegetationHistory = async (req, res) => {
  try {
    const vegetationHistory = await VegetationHealth.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(vegetationHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  analyzeVegetation,
  getVegetationHistory,
};