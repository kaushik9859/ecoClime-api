const mongoose = require('mongoose');

const CropDiseaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  disease: { type: String, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, required: true },
  treatment: { type: String, required: true },
  prevention: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CropDisease', CropDiseaseSchema);