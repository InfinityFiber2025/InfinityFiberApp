let clientes = [];
let nextConta=1;
let usuarioLogado=null;
let tipoLogado=null; // "admin" ou "cliente"
let cofreAgencia = 50000000;

// Pré-cadastrados
function inicializarClientes(){
  criarCliente("Maria Thereza Caldas Braga","maria@teste.com","08819784777","maria_pix",200000);
  criarCliente("Gustavo Caldas Braga","gustavo@teste.com","00625901703","gustavo_pix",200000);
  criarCliente("Daniel Braga Kascher","daniel@teste.com","05379292666","daniel_pix",200000);
}
function criarCliente(nome,email,cpf,pix,saldoInicial){
  const conta=String(nextConta).padStart(6,"0"); nextConta++;
  const senha=Math.random().toString(36).slice(-6);
  clientes.push({nome,email,senha,cpf,banco:"001",agencia:"0001",conta,pix,saldo:saldoInicial});
  cofreAgencia -= saldoInicial;
}

function abrirLoginAdmin(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Administrador</h2>
    <form class="form" onsubmit="event.preventDefault(); loginAdmin()">
      <div><label>Usuário</label><input id="adminUser" value="DanielKascher" /></div>
      <div><label>Senha</label><input type="password" id="adminPass" value="K@scher123" /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}
function loginAdmin(){
  const user=document.getElementById("adminUser").value;
  const pass=document.getElementById("adminPass").value;
  if(user==="DanielKascher" && pass==="K@scher123"){
    usuarioLogado={nome:"Administrador DanielKascher"};
    tipoLogado="admin";
    document.getElementById("loginTela").style.display="none";
    document.getElementById("app").style.display="block";
    abrirDashboardAdmin();
  } else {
    alert("Usuário ou senha inválidos para administrador.");
  }
}
function abrirDashboardAdmin(){
  document.getElementById("titulo").textContent="Ambiente do Banco";
  let html=`<h3>Cofre da Agência: R$ ${cofreAgencia.toLocaleString()}</h3>`;
  html+="<h3>Clientes Cadastrados</h3><ul>";
  clientes.forEach(c=>{
    html+=`<li>${c.nome} — Conta ${c.conta} — Saldo: R$ ${c.saldo.toLocaleString()}</li>`;
  });
  html+="</ul>";
  document.getElementById("conteudo").innerHTML=html;
}

function abrirLoginCliente(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Cliente</h2>
    <form class="form" onsubmit="event.preventDefault(); loginCliente()">
      <div><label>Email</label><input id="loginEmail" required /></div>
      <div><label>Senha</label><input type="password" id="loginSenha" required /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}
function loginCliente(){
  const email=document.getElementById("loginEmail").value;
  const senha=document.getElementById("loginSenha").value;
  const cliente=clientes.find(c=>c.email===email && c.senha===senha);
  if(cliente){
    usuarioLogado=cliente;
    tipoLogado="cliente";
    document.getElementById("loginTela").style.display="none";
    document.getElementById("app").style.display="block";
    abrirDashboardCliente();
  } else {
    alert("Email ou senha inválidos.");
  }
}
function abrirDashboardCliente(){
  document.getElementById("titulo").textContent="Infinity Fiber Digital";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>Bem-vindo, ${usuarioLogado.nome}</h3>
      <p>Conta: ${usuarioLogado.conta} — Agência ${usuarioLogado.agencia}</p>
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">R$ ${usuarioLogado.saldo.toLocaleString()}</p>
    </div>`;
}

window.onload=inicializarClientes;
