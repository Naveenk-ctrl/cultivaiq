import { Link } from 'react-router-dom'
import leafLines from '../assets/leaf-lines.svg'
import logo from '../assets/logo.png'

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="brand">
          <img src={logo} alt="CultivAIQ logo" className="brand-logo" />
          <div>
            <p className="brand-title">CultivAIQ</p>
            <p className="brand-subtitle">Smart Farming Assistant</p>
          </div>
        </div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#purpose">Purpose</a>
          <a href="#why">Why I Built This</a>
          <a href="#security">Security</a>
        </nav>
        <div className="landing-actions">
          <Link className="btn btn-outline" to="/login">
            Sign In
          </Link>
          <Link className="btn btn-primary" to="/register">
            Create Account
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-content">
            <p className="eyebrow">AI + ML</p>
            <h1>Grow smarter decisions with real-time farm intelligence.</h1>
            <p className="hero-text">
              CultivAIQ brings crop recommendations, weather insights, market prices,
              and a helpful chatbot into one clear dashboard. Built for farmers who
              need quick, practical guidance.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/dashboard">
                Launch Dashboard
              </Link>
              <Link className="btn btn-ghost" to="/login">
                View Demo
              </Link>
            </div>
            <div className="hero-metrics">
              <div>
                <h3>Unified</h3>
                <p>Farm data hub</p>
              </div>
              <div>
                <h3>Actionable</h3>
                <p>Decision-ready tips</p>
              </div>
              <div>
                <h3>Farmer-first</h3>
                <p>Simple workflows</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <img src={leafLines} alt="Leaf lines" className="hero-lines" />
            <div className="hero-card-content">
              
              <h2>Soil Data</h2>
              <div className="card-grid">
                <div>
                  <span>Humidity:</span>
                  <strong>58.8</strong>
                </div>
                <div>
                  <span>Nitrogen:</span>
                  <strong>63</strong>
                </div>
                <div>
                  <span>Phosphorus:</span>
                  <strong>52</strong>
                </div>
                
                <div>
                  <span>PH:</span>
                  <strong>6.96</strong>
                </div>
                <div>
                  <span>Rainfall:</span>
                  <strong>63.87</strong>
                </div>
                <div>
                  <span>Crop Suggestion:</span>
                  <strong>Maize</strong>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="purpose" id="purpose">
          <div className="section-title">
            <p className="eyebrow">Purpose</p>
            <h2>Make farming decisions clearer and faster</h2>
            <p>
              CultivAIQ helps farmers turn scattered data into simple, usable guidance
              so they can act with confidence throughout the season.
            </p>
          </div>
          <div className="purpose-grid">
            <article>
              <h3>One place for answers</h3>
              <p>Combine crop advice, weather, and market updates in one view.</p>
            </article>
            <article>
              <h3>Practical next steps</h3>
              <p>Get clear recommendations that help plan daily field work.</p>
            </article>
            <article>
              <h3>Built for real farms</h3>
              <p>Simple language and clean screens that work on any device.</p>
            </article>
          </div>
        </section>

        <section className="feature-grid" id="features">
          <div>
            <h2>Latest features in CultivAIQ</h2>
            <p>
              Designed for speed, clarity, and practical guidance across every
              stage of the farming cycle.
            </p>
            <div className="feature-tags">
              <span>Crop Recommendation</span>
              <span>Weather Insights</span>
              <span>Market Price Updates</span>
              <span>AI Chatbot</span>
              <span>Farmer Dashboard</span>
              
            </div>
          </div>
          <div className="feature-cards">
            <div>
              <h3>Recommendations that fit</h3>
              <p>Crop suggestions based on Soil parameters,Rain fall data.</p>
            </div>
            <div>
              <h3>Weather + market in one view</h3>
              <p>Track local forecasts and price trends without switching apps.</p>
            </div>
            <div>
              <h3>Chatbot support</h3>
              <p>Ask quick questions and get clear, farming-focused responses.</p>
            </div>
          </div>
        </section>

        <section className="why" id="why">
          <div>
            <h2>Why I built this</h2>
            <p>
              I built CultivAIQ to make modern farm guidance easier to access for
              farmers who need fast, reliable answers. The goal is to reduce guesswork
              and help farmers plan with confidence using simple, helpful tools.
            </p>
          </div>
          <div className="why-grid">
            <div>
              <h3>Useful for farmers</h3>
              <p>Focused on real field decisions, not just data charts.</p>
            </div>
            <div>
              <h3>Easy to use</h3>
              <p>Clean screens that work well on phones and low-bandwidth areas.</p>
            </div>
            <div>
              <h3>Always improving</h3>
              <p>Designed to expand as more local insights become available.</p>
            </div>
          </div>
        </section>

        <section className="security" id="security">
          <div>
            <h2>Security built-in</h2>
            <p>
              JWT authentication, protected routes, and file validation keep
              farmer data safe while scaling the platform.
            </p>
          </div>
          <div className="security-list">
            <div>
              <h3>JWT Protected</h3>
              <p>Access tokens secure every API request.</p>
            </div>
            <div>
              <h3>Encrypted Passwords</h3>
              <p>Passwords are hashed with bcrypt before storage.</p>
            </div>
            
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for farmers. Powered by AI.</p>
      </footer>
    </div>
  )
}

export default Landing
