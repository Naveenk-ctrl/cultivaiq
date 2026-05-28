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
          <a href="#modules">Modules</a>
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
            <p className="eyebrow">AI + ML + Computer Vision</p>
            <h1>Grow smarter decisions with real-time crop intelligence.</h1>
            <p className="hero-text">
              CultivAIQ helps farmers detect crop diseases, recommend the right crops,
              and track weather with confidence. Built for real-world farming, tuned
              for fast action.
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
                <h3>7+</h3>
                <p>Core modules</p>
              </div>
              <div>
                <h3>Secure</h3>
                <p>JWT protected API</p>
              </div>
              <div>
                <h3>Fast</h3>
                <p>Optimized ML calls</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <img src={leafLines} alt="Leaf lines" className="hero-lines" />
            <div className="hero-card-content">
              <p className="card-label">Today</p>
              <h2>Field Snapshot</h2>
              <div className="card-grid">
                <div>
                  <span>Soil Moisture</span>
                  <strong>58%</strong>
                </div>
                <div>
                  <span>Leaf Health</span>
                  <strong>Stable</strong>
                </div>
                <div>
                  <span>Crop Suggestion</span>
                  <strong>Millet</strong>
                </div>
                <div>
                  <span>Weather</span>
                  <strong>Clear</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="modules" id="modules">
          <div className="section-title">
            <p className="eyebrow">Module 1 Ready</p>
            <h2>Core platform foundations</h2>
            <p>
              Authentication, farmer dashboard shell, and secure upload scaffolding
              are set for the next ML integrations.
            </p>
          </div>
          <div className="module-grid">
            <article>
              <h3>Secure Auth</h3>
              <p>JWT protection with encrypted passwords.</p>
            </article>
            <article>
              <h3>Dashboard Shell</h3>
              <p>Green professional UI with clear navigation and quick actions.</p>
            </article>
            <article>
              <h3>Upload Pipeline</h3>
              <p>Validated image uploads ready for ML disease prediction.</p>
            </article>
          </div>
        </section>

        <section className="feature-grid" id="features">
          <div>
            <h2>Core features coming online</h2>
            <p>
              Designed for speed, clarity, and practical guidance across every
              stage of the farming cycle.
            </p>
            <div className="feature-tags">
              <span>Crop Disease Prediction</span>
              <span>Crop Recommendation</span>
              <span>Weather Monitoring</span>
              <span>Market Price Updates</span>
              <span>AI Chatbot</span>
            </div>
          </div>
          <div className="feature-cards">
            <div>
              <h3>Unified Insights</h3>
              <p>All recommendations stored for tracking and better decisions.</p>
            </div>
            <div>
              <h3>ML-Ready APIs</h3>
              <p>Node.js connects cleanly to Flask ML services for predictions.</p>
            </div>
            <div>
              <h3>Farmer Focused</h3>
              <p>Simple, readable UI with direct action buttons.</p>
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
            <div>
              <h3>Upload Validation</h3>
              <p>Image-only uploads with size and type checks.</p>
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
