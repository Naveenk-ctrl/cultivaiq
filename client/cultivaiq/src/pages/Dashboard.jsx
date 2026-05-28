import { useEffect, useMemo, useState } from 'react'
import { fetchWeather } from '../services/api.js'

const PROFILE_KEY_PREFIX = 'cultivaiq_profile_'

const safeJsonParse = (raw) => {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '')

function Dashboard() {
  const user = useMemo(() => safeJsonParse(localStorage.getItem('cultivaiq_user')), [])
  const email = normalizeEmail(user?.email)
  const profileKey = email ? `${PROFILE_KEY_PREFIX}${email}` : null
  const savedProfile = useMemo(() => safeJsonParse(profileKey ? localStorage.getItem(profileKey) : null), [profileKey])

  const location = savedProfile?.location || user?.location || ''

  const [weatherState, setWeatherState] = useState({
    status: 'idle',
    data: null,
    error: ''
  })

  useEffect(() => {
    let isActive = true

    const setSafeState = (next) => {
      if (isActive) {
        setWeatherState(next)
      }
    }

    const loadWeather = async () => {
      setSafeState({ status: 'loading', data: null, error: '' })

      if (location) {
        try {
          const response = await fetchWeather({ city: location })
          setSafeState({ status: 'success', data: response.weather, error: '' })
        } catch (err) {
          setSafeState({ status: 'error', data: null, error: err.message })
        }
        return
      }

      if (!navigator.geolocation) {
        setSafeState({
          status: 'error',
          data: null,
          error: 'Add your location in Profile to see local weather.'
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetchWeather({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            })
            setSafeState({ status: 'success', data: response.weather, error: '' })
          } catch (err) {
            setSafeState({ status: 'error', data: null, error: err.message })
          }
        },
        () => {
          setSafeState({
            status: 'error',
            data: null,
            error: 'Enable location access or update Profile location.'
          })
        }
      )
    }

    loadWeather()

    return () => {
      isActive = false
    }
  }, [location])

  const weather = weatherState.data

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>Local weather</h2>
        </div>
        {weatherState.status === 'loading' && <p className="muted">Loading weather...</p>}
        {weatherState.status === 'error' && <p className="error">{weatherState.error}</p>}
        {weatherState.status === 'success' && weather && (
          <div className="result-grid">
            <div>
              <p className="card-label">Temperature</p>
              <h3>{weather.temperature} C</h3>
            </div>
            <div>
              <p className="card-label">Wind speed</p>
              <h3>{weather.windspeed} km/h</h3>
            </div>
            <div>
              <p className="card-label">Condition code</p>
              <p>{weather.weathercode}</p>
            </div>
            <div>
              <p className="card-label">Location</p>
              <p>{weather.location || location || 'Your area'}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
