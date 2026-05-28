import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import predictRoutes from './routes/predictRoutes.js'
import recommendRoutes from './routes/recommendRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'
import marketRoutes from './routes/marketRoutes.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const uploadsDir = path.join(rootDir, 'uploads')

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', authRoutes)
app.use('/api', uploadRoutes)
app.use('/api', predictRoutes)
app.use('/api', recommendRoutes)
app.use('/api', chatRoutes)
app.use('/api', weatherRoutes)
app.use('/api', marketRoutes)

const port = process.env.PORT || 5000

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})
