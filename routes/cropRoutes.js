const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getCropRecommendations,
  getCropSuggestionHistory,
} = require('../controllers/cropController');

router.route('/').post(protect, getCropRecommendations);
router.route('/history').get(protect, getCropSuggestionHistory);

module.exports = router;