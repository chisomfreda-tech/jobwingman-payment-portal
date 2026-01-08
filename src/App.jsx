import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import SpecialistDashboard from './pages/SpecialistDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ClientPipeline from './pages/ClientPipeline'
import DataEntry from './pages/DataEntry'
import InterviewLog from './pages/InterviewLog'
import Leaderboard from './pages/Leaderboard'
import ClientWins from './pages/ClientWins'
import Applications from './pages/Applications'
import Settings from './pages/Settings'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-500">Loading...</div></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { isAdmin } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<SpecialistDashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="interviews" element={<InterviewLog />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="wins" element={<ClientWins />} />
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/applications" element={<ProtectedRoute adminOnly><Applications /></ProtectedRoute>} />
        <Route path="admin/clients" element={<ProtectedRoute adminOnly><ClientPipeline /></ProtectedRoute>} />
        <Route path="admin/entry" element={<ProtectedRoute adminOnly><DataEntry /></ProtectedRoute>} />
        <Route path="admin/interviews" element={<ProtectedRoute adminOnly><InterviewLog /></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
        <Route path="admin/specialist/:id" element={<ProtectedRoute adminOnly><SpecialistDashboard /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
