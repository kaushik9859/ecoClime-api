const CropSuggestion = require('../models/CropSuggestion');
const { getCropSuggestions } = require('../services/geminiService');
const { detectTopCrops } = require('../services/cropDetectionService');

// @desc    Get crop suggestions for location
// @route   POST /api/cropsuggestion
// @access  Private
const getCropRecommendations = async (req, res) => {
  const { location } = req.body;
  const userLocation = location || req.user.location;

  if (!userLocation) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Get crop suggestions from both Streamlit AI model and Gemini API
    const [aiCrops, geminiCrops] = await Promise.all([
      detectTopCrops(userLocation),
      getCropSuggestions(userLocation)
    ]);

    // Combine and prioritize results (you can implement your own logic here)
    const combinedCrops = [...aiCrops, ...geminiCrops]
      .filter((crop, index, self) => 
        index === self.findIndex(c => c.name === crop.name)
      )
      .slice(0, 3); // Get top 3 unique crops

    // Save to database
    const cropSuggestion = await CropSuggestion.create({
      user: req.user._id,
      location: userLocation,
      crops: combinedCrops,
      source: 'combined' // Track the source of the recommendation
    });

    res.status(201).json(cropSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCropSuggestionHistory = async (req, res) => {
  // Example: fetch all crop suggestions for the user
  try {
    const history = await CropSuggestion.find({ user: req.user._id });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCropRecommendations,
  getCropSuggestionHistory,
};