import axios from 'axios'

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`

const normalizeKey = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')

const titleCase = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ')

const uniqueList = (items) => [...new Set(items.filter(Boolean))]

const commodityCandidates = (value) => {
  const raw = value.toString().trim()
  return uniqueList([
    raw,
    titleCase(raw),
    raw.toLowerCase(),
    raw.toUpperCase(),
    raw.replace(/\s+/g, ' ')
  ])
}

const stateAliases = {
  tamilnadu: 'Tamil Nadu',
  jammukashmir: 'Jammu and Kashmir',
  andhrapradesh: 'Andhra Pradesh',
  arunachalpradesh: 'Arunachal Pradesh',
  himachalpradesh: 'Himachal Pradesh',
  madhyapradesh: 'Madhya Pradesh',
  uttarpradesh: 'Uttar Pradesh',
  westbengal: 'West Bengal',
  andamanandnicobar: 'Andaman and Nicobar Islands',
  dadraandnagarhaveli: 'Dadra and Nagar Haveli',
  damananddiu: 'Daman and Diu',
  nctdelhi: 'Delhi',
  pondicherry: 'Puducherry',
  orissa: 'Odisha',
  uttaranchal: 'Uttarakhand'
}

const normalizeState = (value) => {
  if (!value) return ''
  const key = normalizeKey(value)
  return stateAliases[key] || titleCase(value)
}

export const getMarketPrices = async (req, res) => {
  const { commodity, state, district, minPrice, maxPrice, limit = 50 } = req.query
  if (!commodity) {
    return res.status(400).json({ message: 'commodity is required' })
  }

  const apiKey = process.env.DATA_GOV_API_KEY
  if (!apiKey) {
    return res.status(500).json({ message: 'Market API key missing' })
  }

  try {
    const baseParams = {
      'api-key': apiKey,
      format: 'json',
      limit: Number(limit) || 100
    }

    const fetchWithCommodity = async (candidate) => {
      const params = {
        ...baseParams,
        'filters[commodity]': candidate
      }

      if (state) {
        params['filters[state]'] = normalizeState(state)
      }

      if (district) {
        params['filters[district]'] = titleCase(district)
      }

      const response = await axios.get(BASE_URL, { params })
      return response.data?.records || []
    }

    let records = []
    for (const candidate of commodityCandidates(commodity)) {
      records = await fetchWithCommodity(candidate)
      if (records.length) {
        break
      }
    }

    if ((state || district) && records.length === 0) {
      for (const candidate of commodityCandidates(commodity)) {
        const params = {
          ...baseParams,
          'filters[commodity]': candidate
        }
        const response = await axios.get(BASE_URL, { params })
        records = response.data?.records || []
        if (records.length) {
          break
        }
      }
    }

    if (records.length === 0) {
      const wideParams = {
        ...baseParams,
        'filters[commodity]': commodity
      }
      const response = await axios.get(BASE_URL, { params: wideParams })
      records = response.data?.records || []
    }

    const normalizedState = state ? normalizeKey(normalizeState(state)) : ''
    const normalizedDistrict = district ? normalizeKey(district) : ''
    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null

    const filtered = records.filter((record) => {
      if (normalizedState && normalizeKey(record.state) !== normalizedState) {
        return false
      }
      if (normalizedDistrict && normalizeKey(record.district) !== normalizedDistrict) {
        return false
      }

      const price = Number(record.modal_price)
      if (Number.isFinite(min) && price < min) {
        return false
      }
      if (Number.isFinite(max) && price > max) {
        return false
      }

      return true
    })

    const prices = filtered.map((record) => ({
      state: record.state,
      district: record.district,
      market: record.market,
      commodity: record.commodity,
      variety: record.variety,
      grade: record.grade,
      arrivalDate: record.arrival_date,
      minPrice: Number(record.min_price),
      maxPrice: Number(record.max_price),
      modalPrice: Number(record.modal_price),
      unit: 'INR/quintal'
    }))

    res.json({ prices })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market prices' })
  }
}
