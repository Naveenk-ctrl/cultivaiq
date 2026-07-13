import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api.js'

const PROFILE_KEY_PREFIX = 'cultivaiq_profile_'
const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '')

function Login({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const response =
        mode === 'login'
          ? await loginUser(form)
          : await registerUser(form)

      localStorage.setItem('cultivaiq_token', response.token)
      if (response.user) {
        const email = normalizeEmail(response.user.email)
        const profileKey = email ? `${PROFILE_KEY_PREFIX}${email}` : null
        let mergedUser = response.user

        if (profileKey) {
          const rawProfile = localStorage.getItem(profileKey)
          if (rawProfile) {
            try {
              const savedProfile = JSON.parse(rawProfile)
              mergedUser = {
                ...response.user,
                ...savedProfile,
                email: response.user.email
              }
            } catch {
              mergedUser = response.user
            }
          }
        }

        localStorage.setItem('cultivaiq_user', JSON.stringify(mergedUser))
      }
      setMessage('Success! Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 600)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page auth-page">
      <section className="panel auth-card">
        <div className="panel-header">
          <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </label>
          <label className="field password-field">
            <span>Password</span>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 6c4.9 0 8.9 3.5 10.4 5.9.2.3.2.8 0 1.1-1.5 2.4-5.5 5.9-10.4 5.9S3.1 15.4 1.6 13c-.2-.3-.2-.8 0-1.1C3.1 9.5 7.1 6 12 6zm0 1.9c-4 0-7.4 2.7-8.7 4.7 1.3 2 4.7 4.7 8.7 4.7s7.4-2.7 8.7-4.7c-1.3-2-4.7-4.7-8.7-4.7zm0 1.6a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z" />
                </svg>
              </button>
            </div>
          </label>
          <button
            className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              setMode((prev) => (prev === 'login' ? 'register' : 'login'))
            }
          >
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </form>
        {message && <p className="muted">{message}</p>}
      </section>
    </div>
  )
}

export default Login
