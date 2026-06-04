export const getProfile = async (req, res) => {
  const user = req.user

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl || '',
      acres: user.acres || '',
      soilType: user.soilType || '',
      location: user.location || '',
      primaryCrop: user.primaryCrop || ''
    }
  })
}

export const updateProfile = async (req, res) => {
  const user = req.user
  const { name, photoUrl, acres, soilType, location, primaryCrop } = req.body

  if (name) user.name = name.trim()
  if (photoUrl !== undefined) user.photoUrl = photoUrl
  if (acres !== undefined) user.acres = acres
  if (soilType !== undefined) user.soilType = soilType
  if (location !== undefined) user.location = location
  if (primaryCrop !== undefined) user.primaryCrop = primaryCrop

  await user.save()

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl || '',
      acres: user.acres || '',
      soilType: user.soilType || '',
      location: user.location || '',
      primaryCrop: user.primaryCrop || ''
    }
  })
}
