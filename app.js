let clientes = [];
let nextConta=1;

let usuarioLogado=null;
let tipoLogado=null; // "admin" ou "cliente"

// Login Admin
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
    usuarioLogado={nome:"Administrador DanielKascher", banco:"Banco 01", agencia:"0001"};
    tipoLogado="admin";
    document.getElementById("loginTela").style.display="none";
    document.getElementById("app").style.display="block";
    abrirDashboardAdmin();
  } else {
    alert("Usuário ou senha inválidos para administrador.");
  }
}

// Login Cliente
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

// Cadastro Cliente (externo)
function abrirCadastro(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Cadastro de Cliente</h2>
    <form class="form" onsubmit="event.preventDefault(); cadastrarClienteExterno()">
      <div><label>Nome</label><input id="cadNome" required /></div>
      <div><label>Email</label><input id="cadEmail" type="email" required /></div>
      <div><label>CPF</label><input id="cadCPF" required /></div>
      <div><label>Pix</label><input id="cadPix" /></div>
      <button class="btn" type="submit">Cadastrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}

function cadastrarClienteExterno(){
  const nome=document.getElementById("cadNome").value;
  const email=document.getElementById("cadEmail").value;
  const cpf=document.getElementById("cadCPF").value;
  const pix=document.getElementById("cadPix").value;
  criarCliente(nome,email,cpf,pix,null);
  location.reload();
}

// Função central de criar cliente
function criarCliente(nome,email,cpf,pix,foto){
  const conta=String(nextConta).padStart(6,"0"); nextConta++;
  const senha=Math.random().toString(36).slice(-6);
  clientes.push({nome,email,senha,cpf,banco:"Banco 01",agencia:"0001",conta,pix,foto});
  alert(`Cliente criado! Conta ${conta}, agência 0001. Senha enviada para email (${email}): ${senha}`);
}

// Dashboards
function voltarDashboard(){ 
  if(tipoLogado==="admin") abrirDashboardAdmin(); else abrirDashboardCliente();
}
function abrirDashboardAdmin(){
  document.getElementById("titulo").textContent="Ambiente do Banco";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>${usuarioLogado.nome}</h3>
      <p>Banco ${usuarioLogado.banco} — Agência ${usuarioLogado.agencia}</p>
      <h3>Operações Internas</h3>
      <div class="card-grid">
        <div class="card" onclick="abrirClientesAdmin()">
          <div class="card-icon">👥</div>
          <div>Gerenciar Clientes</div>
        </div>
        <div class="card" onclick="abrirRelatorios()">
          <div class="card-icon">📊</div>
          <div>Relatórios</div>
        </div>
      </div>
    </div>`;
}

function abrirDashboardCliente(){
  document.getElementById("titulo").textContent="Infinity Fiber Digital";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>Bem-vindo, ${usuarioLogado.nome}</h3>
      <p>Conta: ${usuarioLogado.conta} — Agência ${usuarioLogado.agencia}</p>
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">R$ 50.000,00</p>
    </div>`;
}

// Clientes e relatórios (Admin)
function abrirClientesAdmin(){
  document.getElementById("titulo").textContent="Clientes Cadastrados";
  let html="<h3>Lista de Clientes</h3><ul>";
  clientes.forEach((c,i)=>{
    html+=`<li>${c.nome} — Conta ${c.conta}</li>`;
  });
  html+="</ul>";
  html+=`<button class="btn" onclick="formNovoCliente()">➕ Criar novo cliente</button>`;
  document.getElementById("conteudo").innerHTML=html;
}

function formNovoCliente(){
  document.getElementById("titulo").textContent="Criar Novo Cliente (Admin)";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarNovoClienteAdmin();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Email</label><input id="novoEmail" type="email" required /></div>
      <div><label>CPF</label><input id="novoCPF" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <button class="btn" type="submit">Salvar</button>
    </form>`;
}

function salvarNovoClienteAdmin(){
  const nome=document.getElementById("novoNome").value;
  const email=document.getElementById("novoEmail").value;
  const cpf=document.getElementById("novoCPF").value;
  const pix=document.getElementById("novoPix").value;
  criarCliente(nome,email,cpf,pix,null);
  abrirClientesAdmin();
}

function abrirRelatorios(){
  document.getElementById("titulo").textContent="Relatórios";
  document.getElementById("conteudo").innerHTML=`
    <p>[Área para relatórios internos do banco]</p>
  `;
}
