import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/disease', label: 'Disease Check' },
  { to: '/crop', label: 'Crop Recommendation' },
  { to: '/chatbot', label: 'AI Chatbot' },
  { to: '/weather', label: 'Weather' },
  { to: '/market', label: 'Market Prices' }
]

function Layout() {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('cultivaiq_token')
    localStorage.removeItem('cultivaiq_user')
    navigate('/')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link className="brand brand-link" to="/dashboard">
          <img src={logo} alt="CultivAIQ logo" className="brand-logo" />
          <div>
            <p className="brand-title">CultivAIQ</p>
            <p className="brand-subtitle">Smart Farming</p>
          </div>
        </Link>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              end={item.to === '/dashboard'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-outline" type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CultivAIQ Console</p>
            <h1>Farmer Dashboard</h1>
          </div>
        </header>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
