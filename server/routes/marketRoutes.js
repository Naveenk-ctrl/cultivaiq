import { Router } from 'express'
import { getMarketPrices } from '../controllers/marketController.js'

const router = Router()

router.get('/market', getMarketPrices)

export default router
