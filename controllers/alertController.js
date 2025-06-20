const Alert = require('../models/Alert');
const ChatMessage = require('../models/ChatMessage');
const { getWeatherAlerts } = require('../services/weatherService');
const { generateChatResponse } = require('../services/geminiService');
const User = require('../models/User');

// @desc    Get weather alerts for a specific location
// @route   GET /api/alerts
// @access  Public
const getWeatherAlertsForLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }
    const alerts = await getWeatherAlerts(location);
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's alerts
// @route   GET /api/alerts/me
// @access  Private
const getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id });
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resolve a weather alert
// @route   POST /api/alerts/resolve
// @access  Private
const resolveAlert = async (req, res) => {
  const { alertId } = req.body;

  if (!alertId) {
    return res.status(400).json({ message: 'Alert ID is required' });
  }

  try {
    // Find the alert and update its status to 'resolved'
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { resolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Chat with agricultural assistant
// @route   POST /api/alerts/chat
// @access  Private
const chatWithAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Get user's location for context
    const user = await User.findById(req.user._id);
    const locationContext = user.location ? `User's location: ${user.location}. ` : '';

    // Create prompt with context
    const prompt = `${locationContext}The user is asking about agriculture: ${message}. 
      Provide a detailed, helpful response focused on agricultural best practices, 
      crop management, and solutions to common farming problems.`;

    // Get response from Gemini API
    const botResponse = await generateChatResponse(prompt);

    // Save conversation to database
    const userMessage = await ChatMessage.create({
      user: req.user._id,
      messageType: 'user',
      content: message,
      context: 'agriculture-assistant'
    });

    const botMessage = await ChatMessage.create({
      user: req.user._id,
      messageType: 'bot',
      content: botResponse,
      context: 'agriculture-assistant'
    });

    res.status(201).json({
      userMessage,
      botMessage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get agriculture chat history
// @route   GET /api/alerts/chat/history
// @access  Private
const getAgricultureChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatMessage.find({
      user: req.user._id,
      context: 'agriculture-assistant'
    })
      .sort({ timestamp: 1 })
      .limit(20);

    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWeatherAlertsForLocation,
  getUserAlerts,
  resolveAlert,
  chatWithAssistant,
  getAgricultureChatHistory
};