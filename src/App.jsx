import React, { useState } from 'react'
import ClienteDashboard from './pages/ClienteDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ModeSelector from './pages/ModeSelector'
import SplashScreen from './pages/SplashScreen'

export default function App() {
  const [splash, setSplash] = useState(true)
  const [mode, setMode] = useState(null)

  if (splash) return <SplashScreen onFinish={() => setSplash(false)} />
  if (!mode) return <ModeSelector onSelect={setMode} />
  if (mode === 'cliente') return <ClienteDashboard />
  if (mode === 'admin') return <AdminDashboard />
  return null
}
