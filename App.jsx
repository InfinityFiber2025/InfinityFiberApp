import React, { useState } from 'react'
import ClienteDashboard from './pages/ClienteDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ModeSelector from './pages/ModeSelector'

export default function App() {
  const [mode, setMode] = useState(null)

  if (!mode) return <ModeSelector onSelect={setMode} />
  if (mode === 'cliente') return <ClienteDashboard />
  if (mode === 'admin') return <AdminDashboard />
  return null
}
