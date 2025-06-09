const ChatMessage = require('../models/ChatMessage');
const { generateChatResponse } = require('../services/geminiService');

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Private
const sendChatMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Save user message
    const userMessage = await ChatMessage.create({
      user: req.user._id,
      messageType: 'user',
      content: message,
    });

    // Get response from Gemini API
    const botResponse = await generateChatResponse(message);

    // Save bot response
    const botMessage = await ChatMessage.create({
      user: req.user._id,
      messageType: 'bot',
      content: botResponse,
    });

    res.status(201).json({
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatMessage.find({
      user: req.user._id,
    })
      .sort({ timestamp: 1 })
      .limit(50); // Limit to 50 most recent messages

    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendChatMessage,
  getChatHistory,
};