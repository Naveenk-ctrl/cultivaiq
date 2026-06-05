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
import profileRoutes from './routes/profileRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

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
app.use('/api', profileRoutes)

app.use((err, req, res, next) => {
  if (err?.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Image is too large. Max size is 5MB.' })
    }
    return res.status(400).json({ message: err.message })
  }
  next(err)
})

const port = process.env.PORT || 5000

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})
