import { useMemo, useState } from 'react'

const PROFILE_KEY_PREFIX = 'cultivaiq_profile_'

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '')

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

  const normalizedEmail = normalizeEmail(user?.email)
  const profileKey = normalizedEmail ? `${PROFILE_KEY_PREFIX}${normalizedEmail}` : null

  const savedProfile = useMemo(() => {
    if (!profileKey) return null
    const raw = localStorage.getItem(profileKey)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [profileKey])

  const [form, setForm] = useState({
    name: savedProfile?.name || user?.name || 'Farmer',
    email: user?.email || savedProfile?.email || 'Not added yet',
    photoUrl: savedProfile?.photoUrl || user?.photoUrl || '',
    acres: savedProfile?.acres || user?.acres || '',
    soilType: savedProfile?.soilType || user?.soilType || '',
    location: savedProfile?.location || user?.location || '',
    primaryCrop: savedProfile?.primaryCrop || user?.primaryCrop || ''
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSave = () => {
    const updated = {
      name: form.name,
      email: user?.email || form.email,
      photoUrl: form.photoUrl,
      acres: form.acres,
      soilType: form.soilType,
      location: form.location,
      primaryCrop: form.primaryCrop
    }
    localStorage.setItem('cultivaiq_user', JSON.stringify(updated))
    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(updated))
    }
    setIsEditing(false)
  }

  const name = form.name || 'Farmer'
  const avatarFallback = name.slice(0, 1).toUpperCase()

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const photo = reader.result
      setForm((prev) => {
        const updated = { ...prev, photoUrl: photo }
        if (profileKey) {
          localStorage.setItem(profileKey, JSON.stringify(updated))
        }
        return updated
      })
    }
    reader.readAsDataURL(file)
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
                Save Details
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
            <p className="muted">Upload a clear photo for your profile.</p>
            {isEditing && (
              <label className="btn btn-outline profile-upload" htmlFor="profilePhoto">
                Change Photo
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            )}
          </div>
        </div>
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
