import { useEffect, useMemo, useState } from 'react'
import { fetchProfile, updateProfile, uploadImage } from '../services/api'

function Profile() {
  const user = useMemo(() => {
    const raw = localStorage.getItem('cultivaiq_user')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  const [form, setForm] = useState({
    name: user?.name || 'Farmer',
    email: user?.email || 'Not added yet',
    photoUrl: user?.photoUrl || '',
    acres: user?.acres || '',
    soilType: user?.soilType || '',
    location: user?.location || '',
    primaryCrop: user?.primaryCrop || ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const data = await fetchProfile()
        const profile = data?.user || {}
        if (!isMounted) return
        setForm((prev) => ({
          ...prev,
          ...profile,
          email: profile.email || prev.email
        }))
      } catch (error) {
        if (isMounted) {
          setSaveError(error.message || 'Failed to load profile')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError('')
      const payload = {
        name: form.name,
        photoUrl: form.photoUrl,
        acres: form.acres,
        soilType: form.soilType,
        location: form.location,
        primaryCrop: form.primaryCrop
      }
      const data = await updateProfile(payload)
      const updated = data?.user || payload
      setForm((prev) => ({
        ...prev,
        ...updated,
        email: updated.email || prev.email
      }))
      localStorage.setItem('cultivaiq_user', JSON.stringify(updated))
      setIsEditing(false)
    } catch (error) {
      setSaveError(error.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const name = form.name || 'Farmer'
  const avatarFallback = name.slice(0, 1).toUpperCase()

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadError('')
      const result = await uploadImage(file)
      const photo = result?.url || ''

      if (!photo) {
        throw new Error('Upload did not return a URL')
      }

      setForm((prev) => {
        const updated = { ...prev, photoUrl: photo }
        localStorage.setItem('cultivaiq_user', JSON.stringify(updated))
        return updated
      })
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header profile-header">
          <div>
            <h2>Farmer Profile</h2>
            <p className="muted">Namaskar, {name}</p>
          </div>
          <div className="topbar-actions">
            {isEditing ? (
              <button className="btn btn-primary" type="button" onClick={handleSave}>
                {isSaving ? 'Saving...' : 'Save Details'}
              </button>
            ) : (
              <button className="btn btn-outline" type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="profile-top">
          <div className="profile-avatar">
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="Farmer profile" />
            ) : (
              <span>{avatarFallback}</span>
            )}
          </div>
          <div className="profile-avatar-meta">
            <p className="card-label">Profile Photo</p>
            <p className="muted">Upload a clear photo for your profile (max 5MB).</p>
            {isEditing && (
              <label className="btn btn-outline profile-upload" htmlFor="profilePhoto">
                {isUploading ? 'Uploading...' : 'Change Photo'}
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            )}
            {uploadError && <p className="error">{uploadError}</p>}
            {saveError && <p className="error">{saveError}</p>}
          </div>
        </div>
        {isLoading && <p className="muted">Loading profile...</p>}
        <div className="profile-grid">
          <div className="profile-card">
            <p className="card-label">Full Name</p>
            {isEditing ? (
              <input
                className="profile-input"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            ) : (
              <h3>{form.name}</h3>
            )}
          </div>
          <div className="profile-card">
            <p className="card-label">Email</p>
            <h3>{form.email}</h3>
          </div>
          <div className="profile-card">
            <p className="card-label">Land Size (acres)</p>
            {isEditing ? (
              <input
                className="profile-input"
                name="acres"
                value={form.acres}
                onChange={handleChange}
                placeholder="e.g., 4"
              />
            ) : (
              <h3>{form.acres || 'Not added yet'}</h3>
            )}
          </div>
          <div className="profile-card">
            <p className="card-label">Soil Type</p>
            {isEditing ? (
              <input
                className="profile-input"
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                placeholder="Loamy"
              />
            ) : (
              <h3>{form.soilType || 'Not added yet'}</h3>
            )}
          </div>
          <div className="profile-card">
            <p className="card-label">Location</p>
            {isEditing ? (
              <input
                className="profile-input"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Village / District"
              />
            ) : (
              <h3>{form.location || 'Not added yet'}</h3>
            )}
          </div>
          <div className="profile-card">
            <p className="card-label">Primary Crop</p>
            {isEditing ? (
              <input
                className="profile-input"
                name="primaryCrop"
                value={form.primaryCrop}
                onChange={handleChange}
                placeholder="Tomato"
              />
            ) : (
              <h3>{form.primaryCrop || 'Not added yet'}</h3>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Profile
