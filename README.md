# Infinity Fiber App — v4.1

Aplicação web demonstrativa para login seguro, transferências e autenticação facial (FACIL).

## 🚀 Como usar

1. Acesse pelo link do GitHub Pages (HTTPS):  
   ```
   https://SEU-USUARIO.github.io/NOME-DO-REPO/
   ```

2. Faça login com as credenciais de demonstração:  
   - Usuário: **DanielKascher**  
   - Senha: **K@scher123**  

3. No dashboard você pode:  
   - Visualizar saldo (oculto por padrão).  
   - Realizar **transferências**.  
   - Usar o botão **FACIL (Biometria)** para autenticar via câmera.  
   - Acompanhar **últimas transferências** e **eventos do sistema**.  

## 📱 Notas importantes sobre a câmera

- O navegador **só libera a câmera em HTTPS** (GitHub Pages já é HTTPS).  
- No **PC**: pode ser necessário liberar a câmera manualmente no ícone de cadeado 🔒 do navegador.  
- No **celular (Android/iOS)**: use **Chrome** ou **Safari**. No iOS o acesso só funciona após clicar no botão **“Ligar câmera”**.  

## 📂 Estrutura

- `index.html` → Arquivo único com todo o código (HTML, CSS, JS).  

## 🛠️ Tecnologias

- HTML5 + TailwindCSS (CDN)  
- JavaScript (vanilla, sem frameworks)  
- getUserMedia API para câmera  
