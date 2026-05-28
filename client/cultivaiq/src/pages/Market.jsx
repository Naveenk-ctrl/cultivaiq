import { useState } from 'react'
import { fetchMarketPrices } from '../services/api.js'

function Market() {
  const [form, setForm] = useState({
    commodity: '',
    state: '',
    district: ''
  })
  const [prices, setPrices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const loadPrices = async (query) => {
    setLoading(true)
    try {
      const response = await fetchMarketPrices(query)
      setPrices(response.prices)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    loadPrices(form)
  }

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>Market price monitoring</h2>
        </div>
        <form className="form-inline" onSubmit={handleSubmit}>
          <input
            type="text"
            name="commodity"
            placeholder="Commodity (required)"
            value={form.commodity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State (e.g., Tamilnadu)"
            value={form.state}
            onChange={handleChange}
          />
          <button className="btn btn-outline" type="submit">
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <div className="table">
          {prices.length === 0 && !loading && (
            <p className="muted">No prices found for the selected filters.</p>
          )}
          {prices.map((item, index) => (
            <div key={`${item.commodity}-${item.market}-${index}`} className="table-row">
              <div>
                <p className="table-title">
                  {item.commodity} - {item.market}
                </p>
                <p className="muted">
                  {item.state}, {item.district}
                </p>
                <p className="muted">
                  Variety: {item.variety} | Grade: {item.grade}
                </p>
              </div>
              <span className="status-pill">
                {item.modalPrice} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Market
