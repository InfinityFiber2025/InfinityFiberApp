# Infinity Fiber App — Deploy Automático

## Como funciona
- Workflow em `.github/workflows/deploy.yml`
- Sempre que fizer `git push main`, o GitHub Actions gera o build e publica no `gh-pages`.

## Deploy manual (se quiser)
```bash
npm install
npm run build
npm run deploy
```

Depois configure GitHub Pages para usar **gh-pages / root**.
