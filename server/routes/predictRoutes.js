import { Router } from 'express'
import { predictDisease } from '../controllers/predictController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/predict', protect, predictDisease)

export default router
