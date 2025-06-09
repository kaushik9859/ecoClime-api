const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  analyzeVegetation,
  getVegetationHistory,
} = require('../controllers/vegetationController');

router.route('/').post(protect, analyzeVegetation);
router.route('/history').get(protect, getVegetationHistory);

module.exports = router;