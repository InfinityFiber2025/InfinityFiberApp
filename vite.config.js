import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/InfinityFiberApp/', // 👈 necessário para funcionar no Pages
})
