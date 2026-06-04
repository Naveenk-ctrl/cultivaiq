import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    authProvider: { type: String, default: 'local' },
    photoUrl: { type: String, default: '' },
    acres: { type: String, default: '' },
    soilType: { type: String, default: '' },
    location: { type: String, default: '' },
    primaryCrop: { type: String, default: '' }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
