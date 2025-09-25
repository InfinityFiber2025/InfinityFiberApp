# InfinityFiberApp 🚀

Aplicação React + Vite + Tailwind com:
- Login (DanielKascher/K@scher123) e Admin (admin/admin)
- Dashboard do cliente (saldo, investimentos, limite > R$3.000, recebimentos futuros)
- Cofre protegido por biometria (captura via câmera e armazenamento local)
- Módulo Administrador (saldo inicial R$ 37,3 bi, aprovações com biometria)

## Rodando localmente
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy no GitHub Pages
Ative Pages em Settings → Pages com a branch `gh-pages`.
Se usar Actions, o workflow deve publicar `dist/` em `gh-pages`.
