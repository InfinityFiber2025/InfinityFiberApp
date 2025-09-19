import React, { useMemo, useState, useEffect } from 'react'

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

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-infinity-card rounded-2xl border border-infinity-border p-4 shadow ${className}`}>
      <div className="text-sm text-infinity-subtext mb-2">{title}</div>
      {children}
    </div>
  )
}

function BottomNav({ current, onChange }) {
  const items = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'transfer', label: 'Transferir', icon: '💸' },
    { key: 'pay', label: 'Pagamentos', icon: '📄' },
    { key: 'cards', label: 'Cartões', icon: '💳' },
    { key: 'profile', label: 'Perfil', icon: '👤' },
    { key: 'settings', label: 'Configurações', icon: '⚙️' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-infinity-surface/95 border-t border-infinity-border">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`flex flex-col items-center py-2 text-xs ${
              current === it.key ? 'text-infinity-primary' : 'text-infinity-subtext'
            }`}
          >
            <span className="text-base leading-none">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
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
            Toque para autorizar a transação.
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

function RecentTransactions({ items }) {
  if (!items?.length) {
    return <div className="text-sm text-infinity-subtext">Sem movimentações recentes.</div>
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between bg-infinity-surface rounded-xl px-3 py-2 border border-infinity-border"
        >
          <div>
            <div className="text-sm font-medium">{tx.description}</div>
            <div className="text-xs text-infinity-subtext">
              {tx.type} • {new Date(tx.dateISO).toLocaleString('pt-BR')}
            </div>
          </div>
          <div className={`text-sm font-semibold ${tx.direction === 'debit' ? 'text-red-400' : 'text-emerald-400'}`}>
            {tx.direction === 'debit' ? '-' : '+'}{currencyBRL(tx.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AppClienteDashboardMVP() {
  const [tab, setTab] = useState('home')
  const [clients, setClients] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fallbackClients = [
    {
      id: 'c1',
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao.silva@example.com',
      phone: '+55 11 91234-5678',
      balance: 1500.0,
      account: '00012345',
      agency: '0001',
      created_at: new Date().toISOString(),
    },
    {
      id: 'c2',
      name: 'Maria Oliveira',
      cpf: '987.654.321-00',
      email: 'maria.oliveira@example.com',
      phone: '+55 21 99876-5432',
      balance: 320.5,
      account: '00054321',
      agency: '0002',
      created_at: new Date().toISOString(),
    },
  ]

  const fallbackTx = [
    {
      id: 't1',
      clientId: 'c1',
      type: 'PIX',
      direction: 'debit',
      description: 'Pix para Maria',
      amount: 120.0,
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: 't2',
      clientId: 'c1',
      type: 'BOLETO',
      direction: 'debit',
      description: 'Pagamento de boleto – Energia',
      amount: 240.9,
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 't3',
      clientId: 'c1',
      type: 'CARTAO',
      direction: 'debit',
      description: 'Compra no cartão',
      amount: 59.9,
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
  ]

  useEffect(() => {
    (async () => {
      const db = await loadJSON('/db_simulado.json', { clients: fallbackClients })
      const tx = await loadJSON('/transactions_simulado.json', { transactions: fallbackTx })
      setClients(db.clients || fallbackClients)
      setTransactions(tx.transactions || fallbackTx)
      setLoading(false)
    })()
  }, [])

  const current = clients[0]

  const saldoAtual = useMemo(() => {
    if (!current) return 0
    const base = current.balance || 0
    const delta = transactions
      .filter((t) => t.clientId === current.id)
      .reduce((acc, t) => acc + (t.direction === 'debit' ? -t.amount : t.amount), 0)
    return base + delta
  }, [current, transactions])

  const [destino, setDestino] = useState('')
  const [valor, setValor] = useState('')
  const [biometricOpen, setBiometricOpen] = useState(false)
  const [toast, setToast] = useState(null)

  function openToast(msg, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  function solicitarTransferencia() {
    if (!valor || Number(valor) <= 0) {
      openToast('Informe um valor válido', 'warn')
      return
    }
    if (!destino.trim()) {
      openToast('Informe uma chave Pix/conta de destino', 'warn')
      return
    }
    setBiometricOpen(true)
  }

  function aprovarTransferencia() {
    setBiometricOpen(false)
    const v = Number(valor)
    if (v > saldoAtual) {
      openToast('Saldo insuficiente', 'error')
      return
    }
    const tx = {
      id: `t${Date.now()}`,
      clientId: current.id,
      type: 'PIX',
      direction: 'debit',
      description: `Pix para ${destino}`,
      amount: v,
      dateISO: new Date().toISOString(),
    }
    setTransactions((prev) => [tx, ...prev])
    setDestino('')
    setValor('')
    openToast('Transferência realizada com sucesso', 'success')
    setTab('home')
  }

  const ultimas = useMemo(
    () => transactions.filter((t) => t.clientId === current?.id).slice(0, 3),
    [transactions, current]
  )

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-infinity-bg text-infinity-text">
        <div className="animate-pulse">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-infinity-bg text-infinity-text pb-20">
      <header className="max-w-md mx-auto px-4 pt-6 pb-3">
        <div className="text-xs text-infinity-subtext">Olá,</div>
        <h1 className="text-2xl font-bold">{current?.name}</h1>
      </header>

      <main className="max-w-md mx-auto px-4 flex flex-col gap-4">
        {tab === 'home' && (
          <>
            <SectionCard title="Saldo disponível">
              <div className="text-3xl font-semibold">{currencyBRL(saldoAtual)}</div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                <button onClick={() => setTab('transfer')} className="py-2 rounded-xl bg-infinity-primary text-white">Pix</button>
                <button onClick={() => setTab('pay')} className="py-2 rounded-xl bg-infinity-surface border border-infinity-border">Pagar</button>
                <button onClick={() => setTab('cards')} className="py-2 rounded-xl bg-infinity-surface border border-infinity-border">Cartão</button>
                <button onClick={() => setTab('profile')} className="py-2 rounded-xl bg-infinity-surface border border-infinity-border">Perfil</button>
              </div>
            </SectionCard>

            <SectionCard title="Movimentações recentes">
              <RecentTransactions items={ultimas} />
            </SectionCard>
          </>
        )}

        {tab === 'transfer' && (
          <>
            <SectionCard title="Transferência (Pix)">
              <label className="block text-sm mb-1">Chave/Conta destino</label>
              <input
                className="w-full px-3 py-2 rounded-xl bg-infinity-surface border border-infinity-border outline-none"
                placeholder="e-mail, CPF, telefone ou conta"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
              <label className="block text-sm mt-3 mb-1">Valor</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 rounded-xl bg-infinity-surface border border-infinity-border outline-none"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
                <button onClick={solicitarTransferencia} className="flex-1 py-2 rounded-xl bg-infinity-primary text-white">Avançar</button>
              </div>
            </SectionCard>

            <SectionCard title="Dicas" className="text-sm">
              • A autorização usa uma biometria simulada (modal).<br/>• Após autorizar, o saldo é atualizado e a transação aparece no extrato.
            </SectionCard>
          </>
        )}

        {tab === 'pay' && (
          <SectionCard title="Pagamentos">
            <div className="text-sm text-infinity-subtext">Fluxo a implementar: leitura de código de barras/QR e confirmação biométrica.</div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
              <button className="flex-1 py-2 rounded-xl bg-zinc-700 text-white" disabled>
                Em breve
              </button>
            </div>
          </SectionCard>
        )}

        {tab === 'cards' && (
          <SectionCard title="Cartão Digital">
            <div className="text-sm text-infinity-subtext">Fluxo a implementar: cartão virtual, bloquear/desbloquear com biometria.</div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
              <button className="flex-1 py-2 rounded-xl bg-zinc-700 text-white" disabled>
                Em breve
              </button>
            </div>
          </SectionCard>
        )}

        
        {tab === 'extrato' && (
          <SectionCard title="Extrato Completo">
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {transactions.filter((t) => t.clientId === current?.id).map((tx) => (
                <div key={tx.id} className="flex justify-between border-b border-infinity-border py-2 text-sm">
                  <span>{tx.description}</span>
                  <span className={tx.direction === 'debit' ? 'text-red-400' : 'text-emerald-400'}>
                    {tx.direction === 'debit' ? '-' : '+'}{currencyBRL(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
            </div>
          </SectionCard>
        )}

        {tab === 'pay' && (
          <SectionCard title="Pagamentos (Simulado)">
            <label className="block text-sm mb-1">Código de barras / QR</label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-infinity-surface border border-infinity-border outline-none"
              placeholder="Digite ou cole o código"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
            <label className="block text-sm mt-3 mb-1">Valor</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 rounded-xl bg-infinity-surface border border-infinity-border outline-none"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
              <button onClick={solicitarTransferencia} className="flex-1 py-2 rounded-xl bg-infinity-primary text-white">
                Simular Pagamento
              </button>
            </div>
          </SectionCard>
        )}
    
        
        {tab === 'settings' && (
          <SectionCard title="Configurações">
            <div className="flex flex-col gap-3 text-sm">
              <button className="w-full text-left py-2 px-3 rounded-xl bg-infinity-surface border border-infinity-border">
                Alterar senha (simulado)
              </button>
              <button className="w-full text-left py-2 px-3 rounded-xl bg-infinity-surface border border-infinity-border">
                Preferências de notificação (simulado)
              </button>
              <button className="w-full text-left py-2 px-3 rounded-xl bg-infinity-surface border border-infinity-border">
                Tema do aplicativo (simulado)
              </button>
              <div className="flex mt-4">
                <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">
                  Voltar
                </button>
              </div>
            </div>
          </SectionCard>
        )}
    
        {tab === 'profile' && (
          <SectionCard title="Perfil">
            <div className="text-sm">{current?.name}</div>
            <div className="text-sm text-infinity-subtext">CPF: {current?.cpf}</div>
            <div className="text-sm text-infinity-subtext">Agência: {current?.agency} • Conta: {current?.account}</div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setTab('home')} className="flex-1 py-2 rounded-xl border border-infinity-border">Voltar</button>
              <button className="flex-1 py-2 rounded-xl bg-zinc-700 text-white" disabled>
                Editar (simulado)
              </button>
            </div>
          </SectionCard>
        )}
      </main>

      <BottomNav current={tab} onChange={setTab} />

      <BiometricModal
        open={biometricOpen}
        onApprove={aprovarTransferencia}
        onCancel={() => setBiometricOpen(false)}
      />

      {toast && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow text-white ${
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warn' ? 'bg-amber-600' : 'bg-zinc-700'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
