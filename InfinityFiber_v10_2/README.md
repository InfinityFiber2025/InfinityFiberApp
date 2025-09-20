
# Infinity Fiber v10 — Protótipo Navegável (Expo / React Native + Web)

## O que está pronto
- **Cliente**: Splash → Welcome → Login → Biometria (câmera, captura, salvar, preview, refazer) → Tabs (Home redesenhada conforme mockup, Transações, Notificações, Perfil)
  - Telas extras: PIX, Boleto/QR, Cartão Digital, Extrato
- **Admin**: Login fixo (Danielkascher / K@scher123) → Dashboard → Clientes → Transações → **Biometria Admin (captura, salvar, preview, usar/refazer)**
  - Usuários, Relatórios (simulados)
- Botão de voltar padrão em todas as telas internas
- Dados mockados (sem backend)

## Como rodar
```bash
npm install
npm start
```
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Observações
- Biometria usa **câmera frontal** (Expo Camera); a foto é salva localmente em `documentDirectory`.
- Splash provisória em `assets/splash.png` (pode trocar pelo logo oficial).
