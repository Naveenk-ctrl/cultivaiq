import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ChatMessage from '../models/ChatMessage.js'

const getMlApiUrl = () => process.env.ML_API_URL || 'http://localhost:7000'
const getGeminiKey = () => process.env.GEMINI_API_KEY
const getGeminiModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const mockChat = (message) => ({
  message,
  response: 'I can help with crop health and weather tips.'
})

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
    model: "gemini-2.5-flash",
    systemInstruction: "You are a helpful assistant. Always format your responses using clean Markdown. Use bullet points for lists and bold text for key terms. Keep paragraphs short and readable.",
  })

  const result = await gemini.generateContent(message)
  const responseText = result?.response?.text()

  if (!responseText) {
    throw new Error('Gemini returned no text')
  }

  return { message, response: responseText }
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
      result = response.data
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
    response: result.response
  })

  res.status(201).json({ chat: record })
}
