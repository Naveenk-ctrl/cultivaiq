import { Navigate } from 'react-router-dom'

const hasToken = () => Boolean(localStorage.getItem('cultivaiq_token'))

function ProtectedRoute({ children }) {
  if (!hasToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
