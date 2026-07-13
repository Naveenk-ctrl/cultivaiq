import { useEffect, useState } from 'react'
import { sendChat } from '../services/api.js'

function StreamingBotMessage({ text, renderBotMessage, shouldStream }) {
  const [visibleText, setVisibleText] = useState(shouldStream ? '' : text)

  useEffect(() => {
    if (!shouldStream) {
      setVisibleText(text)
      return
    }

    let currentIndex = 0
    const timer = setInterval(() => {
      currentIndex += 1
      setVisibleText(text.slice(0, currentIndex))
      if (currentIndex >= text.length) {
        clearInterval(timer)
      }
    }, 12)

    return () => clearInterval(timer)
  }, [text, shouldStream])

  const isStreaming = shouldStream && visibleText.length < text.length

  return (
    <>
      {renderBotMessage(visibleText)}
      {isStreaming && <span className="chat-stream-caret" aria-hidden="true" />}
    </>
  )
}

function Chatbot() {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
      }
      return <span key={`${part}-${index}`}>{part}</span>
    })
  }

  const renderBotMessage = (text) => {
    const lines = text.split(/\r?\n/)
    const elements = []
    let listItems = []

    const flushList = () => {
      if (!listItems.length) return
      const items = listItems
      listItems = []
      elements.push(
        <ul key={`list-${elements.length}`} className="chat-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) {
        flushList()
        elements.push(<div key={`spacer-${index}`} className="chat-spacer" />)
        return
      }

      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ')
      if (isBullet) {
        listItems.push(trimmed.slice(2))
        return
      }

      flushList()
      elements.push(
        <p key={`p-${index}`} className="chat-paragraph">
          {renderInline(line)}
        </p>
      )
    })

    flushList()
    return elements
  }

  const handleSend = async (event) => {
    event.preventDefault()
    if (!message.trim()) {
      return
    }

    const current = message
    setMessage('')
    setLoading(true)
    setHistory((prev) => [...prev, { from: 'user', text: current }])

    try {
      const response = await sendChat({ message: current })
      const reply =
        response?.chat?.response ||
        response?.response ||
        response?.chat?.message ||
        'No response received.'
      setHistory((prev) => [
        ...prev,
        { from: 'bot', text: reply }
      ])
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { from: 'bot', text: err.message }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>CultivAIQ AI Chatbot</h2>
        </div>
        <div className="chat-window">
          {history.length === 0 && (
            <p className="muted">Feel free to ask agriculture related queries.</p>
          )}
          {history.map((item, index) => (
            <div key={`${item.from}-${index}`} className={`chat-bubble ${item.from}`}>
              {item.from === 'bot' ? (
                <StreamingBotMessage
                  text={item.text}
                  renderBotMessage={renderBotMessage}
                  shouldStream={index === history.length - 1 && !loading}
                />
              ) : (
                <p>{item.text}</p>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot typing" aria-live="polite">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          )}
        </div>
        <form className="chat-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask about crops, soil, pests, weather, or market prices..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Chatbot
