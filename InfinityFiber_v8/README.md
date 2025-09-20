
# Infinity Fiber v7 — Protótipo Navegável (Expo / React Native + Web)

Protótipo único com **App Administrativo** e **App Cliente** no mesmo código, pronto para Android, iOS e Web.

## ✅ O que está pronto
- Fluxo **Admin**: Login → Dashboard → Clientes → Transações → Biometria (simulada)
- Fluxo **Cliente**: Welcome → Login → Biometria (simulada) → Dashboard
- Navegação com **React Navigation**
- Componentes básicos (Botão, Input, Card)
- Estilo inspirado nos mockups enviados

## 🚀 Como rodar
1. Instale o Expo CLI (se ainda não tiver):
   ```bash
   npm i -g expo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm start
   ```

4. Plataformas:
   - **Android**: `npm run android`
   - **iOS (macOS)**: `npm run ios`
   - **Web**: `npm run web`

> Dica: Para mobile, você pode usar o **Expo Go** e escanear o QR Code do terminal.

## 📂 Estrutura
```
/src
  /components  -> Botao, Input, Card
  /screens
    /admin     -> LoginAdmin, DashboardAdmin, Clientes, Transacoes, BiometriaAdmin
    /cliente   -> Welcome, LoginCliente, BiometriaCliente, DashboardCliente
  App.tsx      -> Seleção de modo (Admin/Cliente) e rotas
```

## 🔒 Observações
- Não há backend. Todos os dados são **mockados** (exemplo).
- A biometria é apenas **simulada** no protótipo.
- Depois conectamos à API real (JWT, contas, transações etc.).

---
Feito para: **Banco Infinity Fiber** — v7
