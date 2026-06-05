const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('cultivaiq_token')

const parseResponse = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options)
  const data = await parseResponse(response)
  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message
    throw new Error(message || 'Request failed')
  }
  return data
}

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`
})

export const loginUser = (payload) =>
  request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

export const registerUser = (payload) =>
  request('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  })

  const data = await parseResponse(response)
  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message
    throw new Error(message || 'Upload failed')
  }

  return data
}

export const fetchProfile = () =>
  request('/profile', {
    headers: authHeaders()
  })

export const updateProfile = (payload) =>
  request('/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })

export const predictDisease = (payload) =>
  request('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })

export const recommendCrop = (payload) =>
  request('/recommend/crop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })

export const sendChat = (payload) =>
  request('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })

export const fetchWeather = ({ city, lat, lon }) => {
  if (city) {
    return request(`/weather?city=${encodeURIComponent(city)}`)
  }

  return request(`/weather?lat=${lat}&lon=${lon}`)
}

export const fetchMarketPrices = ({ commodity, state, district, minPrice, maxPrice }) => {
  const params = new URLSearchParams()
  if (commodity) params.append('commodity', commodity)
  if (state) params.append('state', state)
  if (district) params.append('district', district)
  if (minPrice) params.append('minPrice', minPrice)
  if (maxPrice) params.append('maxPrice', maxPrice)

  const query = params.toString() ? `?${params.toString()}` : ''
  return request(`/market${query}`)
}
