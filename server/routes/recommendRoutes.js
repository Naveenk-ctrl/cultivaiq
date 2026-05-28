import { Router } from 'express'
import { cropRecommendation } from '../controllers/recommendController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/recommend/crop', protect, cropRecommendation)

export default router
