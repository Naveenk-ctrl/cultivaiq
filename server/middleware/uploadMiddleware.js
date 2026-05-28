import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..', '..')
const uploadsDir = path.join(rootDir, 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase()
    cb(null, `${Date.now()}-${safeName}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg']
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowed.includes(ext)) {
    return cb(new Error('Only .png, .jpg, .jpeg files are allowed'))
  }
  cb(null, true)
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })
