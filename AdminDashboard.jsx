import React, { useEffect, useState } from 'react'

async function loadJSON(path, fallback) {
  try {
    const r = await fetch(path)
    if (!r.ok) throw new Error('fetch error')
    return await r.json()
  } catch {
    return fallback
  }
}

function currencyBRL(n) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)
  } catch {
    return `R$ ${Number(n || 0).toFixed(2)}`
  }
}

function BiometricModal({ open, onApprove, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-infinity-surface w-[92%] max-w-sm rounded-2xl p-6 border border-infinity-border shadow-2xl">
        <div className="text-center">
          <div className="text-4xl mb-2">🔒</div>
          <h3 className="text-lg font-semibold">Autenticação Biométrica</h3>
          <p className="text-sm text-infinity-subtext mt-1">
            Toque para autorizar esta operação de administração.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-infinity-border text-infinity-text"
          >
            Cancelar
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-2 rounded-xl bg-infinity-primary text-white"
          >
            Autorizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const [selectedTx, setSelectedTx] = useState(null)
  const [biometricOpen, setBiometricOpen] = useState(false)
  const [action, setAction] = useState(null) // 'approve' | 'deny'

  function openToast(msg, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    (async () => {
      const db = await loadJSON('/db_simulado.json', { clients: [] })
      const tx = await loadJSON('/transactions_simulado.json', { transactions: [] })
      setClients(db.clients || [])
      setTransactions(tx.transactions || [])
      setLoading(false)
    })()
  }, [])

  const pending = transactions.filter(t => (t.status || 'approved') === 'pending')

  function requestAction(tx, kind) {
    setSelectedTx(tx)
    setAction(kind)
    setBiometricOpen(true)
  }

  function onApproveBiometry() {
    setBiometricOpen(false)
    if (!selectedTx) return
    const updated = transactions.map(t => {
      if (t.id === selectedTx.id) {
        return { ...t, status: action === 'approve' ? 'approved' : 'denied' }
      }
      return t
    })
    setTransactions(updated)
    openToast(action === 'approve' ? 'Transação aprovada' : 'Transação negada', action === 'approve' ? 'success' : 'error')
    setSelectedTx(null)
    setAction(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-infinity-bg text-infinity-text">
        <div className="animate-pulse">Carregando painel do administrador...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-infinity-bg text-infinity-text">
      <header className="max-w-5xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administrador</h1>
        <span className="text-sm text-infinity-subtext">Aprovação de Transações</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-infinity-surface border border-infinity-border rounded-2xl p-4">
          <div className="text-sm text-infinity-subtext mb-2">Pendentes</div>

          {pending.length === 0 ? (
            <div className="text-sm text-infinity-subtext">Nenhuma transação pendente.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-infinity-subtext">
                  <tr>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Data</th>
                    <th className="text-left py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((t) => {
                    const client = clients.find(c => c.id === t.clientId)
                    return (
                      <tr key={t.id} className="border-t border-infinity-border">
                        <td className="py-2">{client ? client.name : t.clientId}</td>
                        <td className="py-2">{t.description}</td>
                        <td className="py-2">{t.type}</td>
                        <td className="py-2">{currencyBRL(t.amount)}</td>
                        <td className="py-2">{new Date(t.dateISO).toLocaleString('pt-BR')}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => requestAction(t, 'approve')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => requestAction(t, 'deny')}
                              className="px-3 py-1 rounded-lg bg-red-600 text-white"
                            >
                              Negar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-infinity-subtext">
          * Este painel é simulado. Para persistir o status aprovado/negado, integre um backend ou salve no localStorage.
        </div>
      </main>

      <BiometricModal
        open={biometricOpen}
        onApprove={onApproveBiometry}
        onCancel={() => { setBiometricOpen(false); setSelectedTx(null); setAction(null); }}
      />

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow text-white ${
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warn' ? 'bg-amber-600' : 'bg-zinc-700'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
