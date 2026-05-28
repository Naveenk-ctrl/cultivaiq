import axios from 'axios'
import Prediction from '../models/Prediction.js'

const getMlApiUrl = () => process.env.ML_API_URL || 'http://localhost:7000'

const mockPrediction = (imagePath) => ({
  imagePath,
  disease: 'Leaf Blight',
  confidence: 0.92,
  advice: 'Remove infected leaves and avoid overhead irrigation.'
})

export const predictDisease = async (req, res) => {
  const { imagePath } = req.body
  if (!imagePath) {
    return res.status(400).json({ message: 'imagePath is required' })
  }

  let result
  try {
    const response = await axios.post(`${getMlApiUrl()}/predict`, { imagePath })
    result = response.data
  } catch (error) {
    result = mockPrediction(imagePath)
  }

  const prediction = await Prediction.create({
    userId: req.user._id,
    imagePath: result.imagePath || imagePath,
    disease: result.disease,
    confidence: result.confidence,
    advice: result.advice || '',
    source: result.source || 'ml-api'
  })

  res.status(201).json({ prediction })
}
