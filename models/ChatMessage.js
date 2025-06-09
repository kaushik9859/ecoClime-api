const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageType: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  context: { type: String, enum: ['general', 'agriculture-assistant'], default: 'general' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);