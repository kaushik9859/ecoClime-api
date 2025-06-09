const axios = require('axios');

const STREAMLIT_VEGETATION_API_URL = process.env.STREAMLIT_VEGETATION_API_URL || 'http://localhost:8501';

async function getVegetationHealth(location) {
  try {
    const response = await axios.post(`${STREAMLIT_VEGETATION_API_URL}/api/vegetation`, {
      location,
    });

    return {
      score: response.data.health_score,
      status: response.data.health_status,
      recommendation: response.data.recommendations,
    };
  } catch (error) {
    console.error('Error calling vegetation API:', error);
    throw error;
  }
}

module.exports = { getVegetationHealth };