import { Router } from 'express'
import { uploadImage } from '../controllers/uploadController.js'
import { protect } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = Router()

router.post('/upload', protect, upload.single('image'), uploadImage)

export default router
