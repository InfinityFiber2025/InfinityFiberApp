import React, { useEffect, useState } from 'react'

export default function ClienteDashboard() {
  const [db, setDb] = useState(null)
  useEffect(() => {
    fetch('/InfinityFiberApp/db_simulado.json').then(r => r.json()).then(setDb)
  }, [])

  if (!db) return <div className="min-h-screen bg-infinity-bg text-infinity-text flex items-center justify-center">Carregando...</div>

  const cliente = db.clients[0]
  return (
    <div className="min-h-screen bg-infinity-bg text-infinity-text flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold">Dashboard Cliente</h2>
      <p className="mt-2">Olá, {cliente.name}</p>
      <p>Saldo: R$ {cliente.balance.toLocaleString('pt-BR')}</p>
    </div>
  )
}
