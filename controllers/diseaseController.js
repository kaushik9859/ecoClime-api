const CropDisease = require('../models/CropDisease');
const { analyzeCropDisease } = require('../services/geminiService');
const upload = require('../middlewares/upload');
const path = require('path');
const fs = require('fs');

// @desc    Analyze crop disease from image
// @route   POST /api/cropdisease
// @access  Private
const analyzeDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imagePath = path.join(__dirname, '..', req.file.path);

    // Analyze image with Gemini API
    const diseaseData = await analyzeCropDisease(imagePath);

    // Save to database
    const cropDisease = await CropDisease.create({
      user: req.user._id,
      image: req.file.path,
      disease: diseaseData.disease,
      confidence: diseaseData.confidence,
      severity: diseaseData.severity,
      treatment: diseaseData.treatment,
      prevention: diseaseData.prevention,
    });

    // Delete the uploaded file after analysis
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.status(201).json(cropDisease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's disease analysis history
// @route   GET /api/cropdisease/history
// @access  Private
const getDiseaseHistory = async (req, res) => {
  try {
    const diseaseHistory = await CropDisease.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(diseaseHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  analyzeDisease,
  getDiseaseHistory,
};