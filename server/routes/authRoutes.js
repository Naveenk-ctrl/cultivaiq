import { Router } from 'express'
import { loginUser, registerUser } from '../controllers/authController.js'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

export default router
