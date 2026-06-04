import cloudinary from '../config/cloudinary.js'

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' })
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'cultivaiq/uploads',
      resource_type: 'image'
    },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Cloudinary upload failed' })
      }

      res.status(201).json({
        message: 'Upload successful',
        url: result.secure_url
      })
    }
  )

  uploadStream.end(req.file.buffer)
}
