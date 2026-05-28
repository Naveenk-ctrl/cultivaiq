import axios from 'axios'
import Recommendation from '../models/Recommendation.js'

const getMlApiUrl = () => process.env.ML_API_URL || 'http://localhost:7000'

const mockCrop = (input) => ({
  input,
  recommendedCrop: 'Millet',
  notes: 'Suited for low rainfall and warm temperatures.'
})


const callMl = async (endpoint, payload, fallback) => {
  try {
    const response = await axios.post(`${getMlApiUrl()}${endpoint}`, payload)
    return response.data
  } catch (error) {
    return fallback(payload)
  }
}

export const cropRecommendation = async (req, res) => {
  const input = req.body
  const result = await callMl('/crop-recommendation', input, mockCrop)

  const record = await Recommendation.create({
    userId: req.user._id,
    type: 'crop',
    input,
    result,
    source: result.source || 'ml-api'
  })

  res.status(201).json({ recommendation: record })
}

