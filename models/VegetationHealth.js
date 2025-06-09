const mongoose = require('mongoose');

const VegetationHealthSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  score: { type: Number, required: true },
  status: { type: String, required: true },
  recommendation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VegetationHealth', VegetationHealthSchema);