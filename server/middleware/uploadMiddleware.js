import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/png', 'image/jpeg']
  if (!allowedMime.includes(file.mimetype)) {
    return cb(new Error('Only .png, .jpg, .jpeg files are allowed'))
  }
  cb(null, true)
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })
