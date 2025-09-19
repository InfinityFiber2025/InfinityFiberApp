import React from 'react'

export default function ModeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-infinity-bg text-infinity-text flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Infinity Fiber</h1>
      <p className="text-infinity-subtext">Escolha o modo de acesso:</p>
      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={() => onSelect('cliente')}
          className="py-3 rounded-xl bg-infinity-primary text-white font-semibold"
        >
          Módulo Cliente
        </button>
        <button
          onClick={() => onSelect('admin')}
          className="py-3 rounded-xl bg-infinity-surface border border-infinity-border font-semibold"
        >
          Módulo Administrador
        </button>
      </div>
    </div>
  )
}
