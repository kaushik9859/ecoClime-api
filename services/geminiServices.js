const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// For text-based queries
async function generateText(prompt) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// For image analysis
async function analyzeImage(imagePath, prompt) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('prompt', prompt);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini Vision API:', error);
    throw error;
  }
}

// Get crop suggestions
async function getCropSuggestions(location) {
  const prompt = `Based on the location ${location}, suggest the top 3 most suitable crops to grow. For each crop, provide a name, description, and optionally an image URL if available. Format the response as a JSON array with objects containing name, description, and image fields.`;
  
  const response = await generateText(prompt);
  return JSON.parse(response);
}

// Analyze crop disease
async function analyzeCropDisease(imagePath) {
  const prompt = 'Analyze this plant image and provide detailed information about any visible diseases. Include the disease name, confidence level (0-1), severity (low, medium, high), treatment recommendations, and prevention methods. Format the response as a JSON object with disease, confidence, severity, treatment, and prevention fields.';
  
  const response = await analyzeImage(imagePath, prompt);
  return JSON.parse(response);
}

// Generate chatbot response
async function generateChatResponse(message) {
  return await generateText(message);
}

module.exports = {
  getCropSuggestions,
  analyzeCropDisease,
  generateChatResponse,
};