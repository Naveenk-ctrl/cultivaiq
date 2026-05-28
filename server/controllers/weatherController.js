import axios from 'axios'

export const getWeather = async (req, res) => {
  const { lat, lon, city } = req.query
  if ((!lat || !lon) && !city) {
    return res.status(400).json({ message: 'city or lat/lon are required' })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ message: 'OpenWeather API key missing' })
  }

  try {
    const params = {
      units: 'metric',
      appid: apiKey
    }

    if (city) {
      params.q = city
    } else {
      params.lat = lat
      params.lon = lon
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      { params }
    )

    const weather = response.data
    res.json({
      weather: {
        temperature: weather.main?.temp,
        windspeed: weather.wind?.speed,
        weathercode: weather.weather?.[0]?.description || 'unknown',
        location: weather.name
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather data' })
  }
}
