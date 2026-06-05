import { useState } from 'react'
import { predictDisease } from '../services/api.js'

function Disease() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const readFileAsDataUrl = (selectedFile) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(selectedFile)
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Please choose an image file first.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const imageBase64 = await readFileAsDataUrl(file)
      const response = await predictDisease({ imageBase64, filename: file.name })
      setResult(response.prediction)
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
          <h2>Crop disease prediction</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Upload leaf image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files[0])}
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Predict disease'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Prediction result</h2>
        </div>
        {result ? (
          <div className="result-grid">
            <div>
              <p className="card-label">Disease</p>
              <h3>{result.disease}</h3>
            </div>
            <div>
              <p className="card-label">Confidence</p>
              <h3>{Math.round(result.confidence * 100)}%</h3>
            </div>
            <div>
              <p className="card-label">Advice</p>
              <p>{result.advice}</p>
            </div>
          </div>
        ) : (
          <p className="muted">Upload an image to see prediction details.</p>
        )}
      </section>
    </div>
  )
}

export default Disease
