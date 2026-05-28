import { useState } from 'react'
import { recommendCrop } from '../services/api.js'

function Crop() {
  const [form, setForm] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })
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
      const payload = {
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall)
      }
      const response = await recommendCrop(payload)
      setResult(response.recommendation.result)
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
          <h2>Crop recommendation</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nitrogen (N)</span>
            <input
              type="number"
              name="nitrogen"
              value={form.nitrogen}
              onChange={handleChange}
              placeholder="Enter nitrogen value"
              required
            />
          </label>
          <label className="field">
            <span>Phosphorous (P)</span>
            <input
              type="number"
              name="phosphorus"
              value={form.phosphorus}
              onChange={handleChange}
              placeholder="Enter phosphorous value"
              required
            />
          </label>
          <label className="field">
            <span>Potassium (K)</span>
            <input
              type="number"
              name="potassium"
              value={form.potassium}
              onChange={handleChange}
              placeholder="Enter potassium value"
              required
            />
          </label>
          <label className="field">
            <span>Temperature (°C)</span>
            <input
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="Enter temperature"
              required
            />
          </label>
          <label className="field">
            <span>Humidity (%)</span>
            <input
              type="number"
              name="humidity"
              value={form.humidity}
              onChange={handleChange}
              placeholder="Enter humidity"
              required
            />
          </label>
          <label className="field">
            <span>pH</span>
            <input
              type="number"
              name="ph"
              value={form.ph}
              onChange={handleChange}
              placeholder="Enter soil pH"
              required
            />
          </label>
          <label className="field">
            <span>Rainfall (mm)</span>
            <input
              type="number"
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              placeholder="Enter rainfall"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Get recommendation'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Recommended crop</h2>
        </div>
        {result ? (
          <div className="result-grid">
            <div>
              <p className="card-label">Crop</p>
              <h3>{result.recommendedCrop}</h3>
            </div>
            <div>
              <p className="card-label">Notes</p>
              <p>{result.notes}</p>
            </div>
          </div>
        ) : (
          <p className="muted">Submit the form to see a recommendation.</p>
        )}
      </section>
    </div>
  )
}

export default Crop
