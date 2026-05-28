import { Router } from 'express'
import { chatWithBot } from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/chat', protect, chatWithBot)

export default router
