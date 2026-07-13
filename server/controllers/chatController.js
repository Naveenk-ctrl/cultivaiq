import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ChatMessage from '../models/ChatMessage.js'

const getMlApiUrl = () => process.env.ML_API_URL || 'http://localhost:7000'
const getGeminiKey = () => process.env.GEMINI_API_KEY
const getGeminiModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const MAX_RESPONSE_LINES = 4

const NON_AGRI_REPLY =
  'I only provide agriculture-related assistance.\nPlease ask about crops, soil, pests, irrigation, weather, or market prices.'

const mockChat = (message) => ({
  message,
  response: 'I can help only with agriculture topics.\nAsk about crops, pests, irrigation, weather, or market prices.'
})

const normalizeResponse = (text) => {
  if (!text) return NON_AGRI_REPLY

  const compact = text
    .replace(/\r/g, '')
    .split('\n')
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, ''))

  if (!compact.length) {
    return NON_AGRI_REPLY
  }

  return compact.slice(0, MAX_RESPONSE_LINES).join('\n')
}

const callGemini = async (message) => {
  const apiKey = getGeminiKey()
  if (!apiKey) {
    console.warn('Gemini API key not set. Falling back to ML API.')
    return null
  }

  const model = getGeminiModel()
  console.log('Gemini model:', model)
  const genAI = new GoogleGenerativeAI(apiKey)
  const gemini = genAI.getGenerativeModel({
    model,
    systemInstruction: `You are an agriculture assistant for farmers.
Only answer agriculture-related topics such as crops, soil, pests, diseases, irrigation, fertilizer, weather, and market prices.
If the user asks a non-agriculture question, politely refuse and ask an agriculture-related question instead.
Output plain text only.
Keep every answer concise: maximum ${MAX_RESPONSE_LINES} short lines.
Do not write long paragraphs.`,
  })

  const result = await gemini.generateContent(message)
  const responseText = result?.response?.text()

  if (!responseText) {
    throw new Error('Gemini returned no text')
  }

  return { message, response: normalizeResponse(responseText) }
}

export const chatWithBot = async (req, res) => {
  const { message } = req.body
  if (!message) {
    return res.status(400).json({ message: 'message is required' })
  }

  let result
  try {
    result = await callGemini(message)
    if (!result) {
      const response = await axios.post(`${getMlApiUrl()}/chat`, { message })
      result = {
        ...response.data,
        response: normalizeResponse(response.data?.response)
      }
    }
  } catch (error) {
    const status = error.response?.status
    const data = error.response?.data
    console.error('Gemini error:', status, data || error.message)
    result = mockChat(message)
  }

  console.log('Chat response:', result)

  const record = await ChatMessage.create({
    userId: req.user._id,
    message: result.message || message,
    response: normalizeResponse(result.response)
  })

  res.status(201).json({ chat: record })
}
