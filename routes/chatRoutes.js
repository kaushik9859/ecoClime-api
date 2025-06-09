const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { sendChatMessage, getChatHistory } = require('../controllers/chatController');

router.route('/').post(protect, sendChatMessage);
router.route('/history').get(protect, getChatHistory);

module.exports = router;