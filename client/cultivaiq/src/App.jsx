import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Chatbot from './pages/Chatbot.jsx'
import Crop from './pages/Crop.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Disease from './pages/Disease.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Market from './pages/Market.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Weather from './pages/Weather.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/crop" element={<Crop />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
