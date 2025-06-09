const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getWeatherAlertsForLocation,
  getUserAlerts,
  resolveAlert,
  chatWithAssistant,
  getAgricultureChatHistory
} = require('../controllers/alertController');

router.route('/weather').post(protect, getWeatherAlertsForLocation);
router.route('/').get(protect, getUserAlerts);
router.route('/:id/resolve').put(protect, resolveAlert);
router.route('/chat').post(protect, chatWithAssistant);
router.route('/chat/history').get(protect, getAgricultureChatHistory);

module.exports = router;