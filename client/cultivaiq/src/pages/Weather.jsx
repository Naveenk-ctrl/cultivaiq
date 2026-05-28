import { useState } from 'react'
import { fetchWeather } from '../services/api.js'

function Weather() {
  const [form, setForm] = useState({ city: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetchWeather(form)
      setResult(response.weather)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>Weather monitoring</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>City name</span>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Check weather'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Current conditions</h2>
        </div>
        {result ? (
          <div className="result-grid">
            <div>
              <p className="card-label">Temperature</p>
              <h3>{result.temperature} C</h3>
            </div>
            <div>
              <p className="card-label">Wind speed</p>
              <h3>{result.windspeed} km/h</h3>
            </div>
            <div>
              <p className="card-label">Condition code</p>
              <p>{result.weathercode}</p>
            </div>
            <div>
              <p className="card-label">Location</p>
              <p>{result.location}</p>
            </div>
          </div>
        ) : (
          <p className="muted">Enter a city name to fetch weather.</p>
        )}
      </section>
    </div>
  )
}

export default Weather
