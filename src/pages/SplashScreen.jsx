import React, { useEffect } from 'react'

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 2000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-animated-gradient animate-fadeIn">
      <img src="/InfinityFiberApp/logo.png" alt="Infinity Fiber" className="w-32 h-32 mb-6 drop-shadow-lg" />
      <h1 className="text-3xl font-bold">Bem-vindo</h1>
      <p className="text-lg opacity-90 mt-2">Banco Digital Infinity Fiber</p>
    </div>
  )
}
