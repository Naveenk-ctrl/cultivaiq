export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' })
  }

  res.status(201).json({
    message: 'Upload successful',
    file: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size
    }
  })
}
