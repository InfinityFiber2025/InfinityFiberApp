# Infinity Fiber PWA

Este repositório contém a versão PWA (Progressive Web App) do sistema **Infinity Fiber Ltda — CNPJ: 28.430.524/0001-31**.

---

## 📂 Estrutura de Arquivos

```
InfinityFiberApp/
│
├── Infinity_Fiber_Versao_1m_PWA.html   # Arquivo principal (interface do app)
├── manifest.json                       # Configuração do PWA (nome, ícones, cores)
├── service-worker.js                   # Service Worker (cache offline básico)
├── icon-192.png                        # Ícone do app (192x192)
└── icon-512.png                        # Ícone do app (512x512)
```

---

## 🚀 Publicação no GitHub Pages

1. Crie um repositório no GitHub chamado **InfinityFiberApp**.
2. Clone o repositório em sua máquina e copie todos os arquivos acima para dentro dele.
3. No terminal, execute os comandos:

```bash
git init
git add .
git commit -m "Versão inicial do Infinity Fiber PWA"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/InfinityFiberApp.git
git push -u origin main
```

4. No GitHub, vá em **Settings > Pages**.
5. Em **Source**, selecione `main` e a pasta `/root`, depois clique em **Save**.

Após alguns minutos, seu app estará disponível em:

```
https://SEU_USUARIO.github.io/InfinityFiberApp/Infinity_Fiber_Versao_1m_PWA.html
```

---

## 📱 Instalação como App

1. Acesse o link no navegador do seu celular.
2. Clique em **Adicionar à Tela Inicial**.
3. O Infinity Fiber PWA ficará disponível como um aplicativo independente.

---

## ℹ️ Observações

- Para que a câmera funcione, o app **precisa rodar em HTTPS** (o GitHub Pages já fornece isso automaticamente).
- Caso rode localmente, use `http://localhost` em vez de abrir o arquivo direto, senão o navegador vai bloquear a câmera.
- Os ícones (`icon-192.png` e `icon-512.png`) já estão configurados no `manifest.json`.

---

✍️ Desenvolvido para **Infinity Fiber Ltda — CNPJ: 28.430.524/0001-31**
