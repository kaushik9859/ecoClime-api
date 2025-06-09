const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  analyzeDisease,
  getDiseaseHistory,
} = require('../controllers/diseaseController');

router.route('/').post(protect, upload.single('image'), analyzeDisease);
router.route('/history').get(protect, getDiseaseHistory);

module.exports = router;