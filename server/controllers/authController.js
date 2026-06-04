import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: 'local'
  })

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      acres: user.acres,
      soilType: user.soilType,
      location: user.location,
      primaryCrop: user.primaryCrop
    }
  })
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      acres: user.acres,
      soilType: user.soilType,
      location: user.location,
      primaryCrop: user.primaryCrop
    }
  })
}
