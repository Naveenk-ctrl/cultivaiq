import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    disease: { type: String, required: true },
    confidence: { type: Number, required: true },
    advice: { type: String, default: '' },
    source: { type: String, default: 'ml-api' }
  },
  { timestamps: true }
)

const Prediction = mongoose.model('Prediction', predictionSchema)

export default Prediction
