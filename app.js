let clientes = [
  {nome:"Infinity Fiber Digital", email:"infinity@fiber.com", senha:"123456", banco:"Banco Infinity", agencia:"0001", conta:"12345-6", pix:"infinity@fiber.com", foto:null}
];

let usuarioLogado=null;

// Abrir Login
function abrirLogin(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Login</h2>
    <form class="form" onsubmit="event.preventDefault(); login()">
      <div><label>Email</label><input id="loginEmail" required /></div>
      <div><label>Senha</label><input type="password" id="loginSenha" required /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}

// Login
function login(){
  const email=document.getElementById("loginEmail").value;
  const senha=document.getElementById("loginSenha").value;
  const cliente=clientes.find(c=>c.email===email && c.senha===senha);
  if(cliente){
    usuarioLogado=cliente;
    document.getElementById("loginTela").style.display="none";
    document.getElementById("app").style.display="block";
    abrirDashboard();
  } else {
    alert("Usuário ou senha inválidos.");
  }
}

// Abrir Cadastro
function abrirCadastro(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Cadastro</h2>
    <form class="form" onsubmit="event.preventDefault(); cadastrarCliente()">
      <div><label>Nome</label><input id="cadNome" required /></div>
      <div><label>Email</label><input id="cadEmail" type="email" required /></div>
      <div><label>CPF</label><input id="cadCPF" required /></div>
      <div><label>Banco</label><input id="cadBanco" required /></div>
      <div><label>Agência</label><input id="cadAgencia" required /></div>
      <div><label>Conta</label><input id="cadConta" required /></div>
      <div><label>Pix</label><input id="cadPix" /></div>
      <div>
        <label>Foto</label>
        <input type="file" id="cadFoto" accept="image/*" onchange="previewFoto(event)" />
        <img id="preview" class="foto-preview" style="display:none;" />
      </div>
      <button class="btn" type="submit">Cadastrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}

// Preview foto
function previewFoto(event){
  const file=event.target.files[0];
  if(file){
    const reader=new FileReader();
    reader.onload=function(e){
      const img=document.getElementById("preview");
      img.src=e.target.result;
      img.style.display="block";
    }
    reader.readAsDataURL(file);
  }
}

// Cadastro cliente
function cadastrarCliente(){
  const nome=document.getElementById("cadNome").value;
  const email=document.getElementById("cadEmail").value;
  const cpf=document.getElementById("cadCPF").value;
  const banco=document.getElementById("cadBanco").value;
  const agencia=document.getElementById("cadAgencia").value;
  const conta=document.getElementById("cadConta").value;
  const pix=document.getElementById("cadPix").value;
  const foto=document.getElementById("preview").src||null;

  // gerar senha automática
  const senha=Math.random().toString(36).slice(-6);
  clientes.push({nome,email,senha,banco,agencia,conta,pix,foto});
  alert(`Cadastro concluído! Sua senha foi enviada para o email (${email}): ${senha}`);
  location.reload();
}

// Dashboard
function voltarDashboard(){ abrirDashboard(); }
function abrirDashboard(){
  document.getElementById("titulo").textContent="Infinity Fiber Digital";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>Bem-vindo, ${usuarioLogado.nome}</h3>
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">R$ 50.000,00</p>
    </div>
    <div class="card-grid">
      <div class="card" onclick="abrirClientes()">
        <div class="card-icon">👤</div>
        <div>Clientes</div>
      </div>
      <div class="card" onclick="abrirTransferenciaNovo()">
        <div class="card-icon">💸</div>
        <div>Transferência</div>
      </div>
      <div class="card" onclick="abrirPagamentos()">
        <div class="card-icon">📷</div>
        <div>Pagamentos</div>
      </div>
    </div>`;
}

// CLIENTES
function abrirClientes(){
  document.getElementById("titulo").textContent="Clientes";
  let html="<h3>Lista de Clientes</h3><ul>";
  clientes.forEach((c,i)=>{
    html+=`<li onclick="abrirCliente(${i})">${c.nome}</li>`;
  });
  html+="</ul>";
  document.getElementById("conteudo").innerHTML=html;
}

function abrirCliente(i){
  const c=clientes[i];
  document.getElementById("titulo").textContent="Cliente";
  document.getElementById("conteudo").innerHTML=`
    <div style='text-align:center;'>
      ${c.foto? `<img src="${c.foto}" class="foto-preview" />`:""}
      <h3>${c.nome}</h3>
      <p>Email: ${c.email}</p>
      <p>Banco: ${c.banco}</p>
      <p>Agência: ${c.agencia}</p>
      <p>Conta: ${c.conta}</p>
      <p>Pix: ${c.pix}</p>
    </div>
  `;
}

// TRANSFERÊNCIA
function abrirTransferenciaNovo(){
  document.getElementById("titulo").textContent="Transferência — Novo Cliente";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); simularTransferenciaNovo();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Banco</label><input id="novoBanco" required /></div>
      <div><label>Agência</label><input id="novoAgencia" required /></div>
      <div><label>Conta</label><input id="novoConta" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <div><label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div><label>Valor</label><input type="number" id="valor" required /></div>
      <button class="btn" type="submit">Enviar</button>
      <p id="mensagem"></p>
    </form>`;
}

function simularTransferenciaNovo(){
  const nome=document.getElementById("novoNome").value;
  const banco=document.getElementById("novoBanco").value;
  const agencia=document.getElementById("novoAgencia").value;
  const conta=document.getElementById("novoConta").value;
  const pix=document.getElementById("novoPix").value;
  const tipo=document.getElementById("tipo").value;
  const valor=parseFloat(document.getElementById("valor").value||0);
  const msg=document.getElementById("mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  const agora=new Date(); const h=agora.getHours(); const d=agora.getDay();
  let resultado="";
  if(tipo==="PIX"){ resultado=`PIX de R$${valor.toFixed(2)} realizado com sucesso para ${nome}`; }
  else if(d===0||d===6||h<8||h>17){ resultado=`Transferência ${tipo} agendada para o próximo dia útil.`; }
  else{ resultado=`Transferência ${tipo} de R$${valor.toFixed(2)} realizada com sucesso para ${nome}`; }
  msg.textContent=resultado;
}

// PAGAMENTOS
function abrirPagamentos(){
  document.getElementById("titulo").textContent="Pagamentos";
  document.getElementById("conteudo").innerHTML=`
    <div class="card-grid">
      <div class="card" onclick="alert('Gerar QR Code ainda em desenvolvimento')">
        <div class="card-icon">🔳</div>
        <div>Gerar QR Code</div>
      </div>
      <div class="card" onclick="alert('Ler QR Code ainda em desenvolvimento')">
        <div class="card-icon">📷</div>
        <div>Ler QR Code</div>
      </div>
    </div>`;
}
