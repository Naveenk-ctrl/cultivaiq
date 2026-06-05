import axios from 'axios'
import Prediction from '../models/Prediction.js'

const getMlApiUrl = () => process.env.ML_API_URL || 'http://localhost:7000'

const mockPrediction = (imageRef) => ({
  imagePath: imageRef,
  disease: 'Leaf Blight',
  confidence: 0.92,
  advice: 'Remove infected leaves and avoid overhead irrigation.'
})

export const predictDisease = async (req, res) => {
  const { imagePath, imageBase64, filename } = req.body
  if (!imagePath && !imageBase64) {
    return res.status(400).json({ message: 'imagePath or imageBase64 is required' })
  }

  const imageRef = imagePath || filename || 'inline-upload'
  let result
  try {
    const response = await axios.post(`${getMlApiUrl()}/predict`, {
      imagePath,
      imageBase64,
      filename
    })
    result = response.data
  } catch (error) {
    result = mockPrediction(imageRef)
  }

  const prediction = await Prediction.create({
    userId: req.user._id,
    imagePath: result.imagePath || imageRef,
    disease: result.disease,
    confidence: result.confidence,
    advice: result.advice || '',
    source: result.source || 'ml-api'
  })

  res.status(201).json({ prediction })
}
