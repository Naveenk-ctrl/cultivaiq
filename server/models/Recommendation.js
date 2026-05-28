import mongoose from 'mongoose'

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['crop'], required: true },
    input: { type: Object, required: true },
    result: { type: Object, required: true },
    source: { type: String, default: 'ml-api' }
  },
  { timestamps: true }
)

const Recommendation = mongoose.model('Recommendation', recommendationSchema)

export default Recommendation
