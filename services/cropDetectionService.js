const axios = require('axios');

const STREAMLIT_CROP_API_URL = process.env.STREAMLIT_CROP_API_URL || 'http://localhost:8502';

async function detectTopCrops(location) {
  try {
    const response = await axios.post(`${STREAMLIT_CROP_API_URL}/api/crop-detection`, {
      location,
    });

    return response.data.top_crops.map(crop => ({
      name: crop.name,
      description: crop.description,
      suitability: crop.suitability_score,
      image: crop.image_url || null
    }));
  } catch (error) {
    console.error('Error calling crop detection API:', error);
    throw error;
  }
}

module.exports = { detectTopCrops };