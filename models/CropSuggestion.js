const mongoose = require('mongoose');

const CropSuggestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  crops: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CropSuggestion', CropSuggestionSchema);