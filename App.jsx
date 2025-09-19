import React, { useState } from 'react'
import AppClienteDashboardMVP from './pages/AppClienteDashboardMVP'
import AdminDashboard from './pages/AdminDashboard'
import ModeSelector from './pages/ModeSelector'

export default function App() {
  const [mode, setMode] = useState(null)

  if (!mode) return <ModeSelector onSelect={setMode} />
  if (mode === 'cliente') return <AppClienteDashboardMVP />
  if (mode === 'admin') return <AdminDashboard />
  return null
}
