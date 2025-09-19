import React, { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [db, setDb] = useState(null)
  useEffect(() => {
    fetch('/db_simulado.json').then(r => r.json()).then(setDb)
  }, [])

  if (!db) return <div className="min-h-screen bg-infinity-bg text-infinity-text flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-infinity-bg text-infinity-text flex flex-col items-center justify-center gap-3">
      <h2 className="text-xl font-bold">Dashboard Administrador</h2>
      <p>Cofre do Banco: R$ {db.bankVault.toLocaleString('pt-BR')}</p>
      <div>
        <h3 className="font-semibold">Clientes:</h3>
        {db.clients.map(c => (
          <p key={c.id}>{c.name}: R$ {c.balance.toLocaleString('pt-BR')}</p>
        ))}
      </div>
    </div>
  )
}
