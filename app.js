// ===== Estado base =====
let clientes = [];
let nextConta=1;
let usuarioLogado=null;
let tipoLogado=null; // "admin" ou "cliente"
let cofreAgencia = 50000000; // R$ 50 milhões
let transacoes = []; // histórico global

// ===== Utilidades =====
function isBusinessDay(date){ const d=date.getDay(); return d!==0 && d!==6; }
function nextBusinessDay(date){ const r=new Date(date); do{ r.setDate(r.getDate()+1); } while(!isBusinessDay(r)); return r; }
function formatDate(d){ return d.toLocaleString(); }
function moeda(v){ return 'R$ '+Number(v).toLocaleString(); }

// ===== Clientes base (pré-cadastrados) =====
function inicializarClientes(){
  criarCliente("Maria Thereza Caldas Braga","maria@teste.com","08819784777","maria_pix",200000,true);
  criarCliente("Gustavo Caldas Braga","gustavo@teste.com","00625901703","gustavo_pix",200000,true);
  criarCliente("Daniel Braga Kascher","daniel@teste.com","05379292666","daniel_pix",200000,true);
}
function criarCliente(nome,email,cpf,pix,valorInicial,preCadastro=false){
  const conta=String(nextConta).padStart(6,"0"); nextConta++;
  const senha=Math.random().toString(36).slice(-6);
  clientes.push({nome,email,senha,cpf,banco:"001",agencia:"0001",conta,pix,saldo:valorInicial,extrato:[],status:"ATIVA"});
  cofreAgencia -= valorInicial;
  if(!preCadastro) alert(`Cliente criado! Conta ${conta}, Agência 0001. Senha enviada para ${email}.`);
}

// ===== Login Admin =====
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
  } else { alert("Usuário ou senha inválidos para administrador."); }
}

// ===== Login Cliente =====
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
    usuarioLogado=cliente; tipoLogado="cliente";
    document.getElementById("loginTela").style.display="none";
    document.getElementById("app").style.display="block";
    abrirDashboardCliente();
  } else { alert("Email ou senha inválidos."); }
}

// ===== Cadastro público =====
function abrirCadastro(){
  document.getElementById("loginTela").innerHTML=`
    <h2 style='text-align:center'>Cadastro de Cliente</h2>
    <form class="form" onsubmit="event.preventDefault(); cadastrarClientePublico()">
      <div><label>Nome</label><input id="cadNome" required /></div>
      <div><label>Email</label><input id="cadEmail" type="email" required /></div>
      <div><label>CPF</label><input id="cadCPF" required /></div>
      <div><label>Pix</label><input id="cadPix" /></div>
      <div><label>Saldo Inicial</label><input id="cadSaldo" type="number" value="1000" /></div>
      <button class="btn" type="submit">Cadastrar</button>
    </form>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}
function cadastrarClientePublico(){
  const nome=document.getElementById("cadNome").value;
  const email=document.getElementById("cadEmail").value;
  const cpf=document.getElementById("cadCPF").value;
  const pix=document.getElementById("cadPix").value;
  const saldo=parseFloat(document.getElementById("cadSaldo").value||0);
  if(saldo>cofreAgencia){ alert("Cofre insuficiente para este saldo inicial."); return; }
  criarCliente(nome,email,cpf,pix,saldo,false);
  location.reload();
}

// ===== Dashboards =====
function voltarDashboard(){ if(tipoLogado==="admin") abrirDashboardAdmin(); else abrirDashboardCliente(); }
function abrirDashboardAdmin(){
  document.getElementById("titulo").textContent="Back Office — Infinity Fiber";
  document.getElementById("conteudo").innerHTML=`
    <div class='card-grid'>
      <div class='card' onclick='abrirCofre()'><div class='card-icon'>🏦</div><div>Cofre da Agência</div></div>
      <div class='card' onclick='abrirClientesAdmin()'><div class='card-icon'>👥</div><div>Clientes</div></div>
      <div class='card' onclick='abrirTransacoesAdmin()'><div class='card-icon'>🔄</div><div>Transações</div></div>
      <div class='card' onclick='abrirCriarClienteAdmin()'><div class='card-icon'>➕</div><div>Novo Cliente</div></div>
    </div>`;
}
function abrirCofre(){
  document.getElementById("titulo").textContent="Cofre da Agência";
  document.getElementById("conteudo").innerHTML=`
    <h3>Saldo do Cofre: ${moeda(cofreAgencia)}</h3>
    <p>Banco 001 — Agência 0001</p>
  `;
}

// ===== Clientes (Admin) =====
function abrirClientesAdmin(){
  document.getElementById("titulo").textContent="Clientes";
  let html="<table class='table'><tr><th>Nome</th><th>Conta</th><th>Saldo</th><th>Ações</th></tr>";
  clientes.forEach((c,i)=>{
    html+=`<tr>
      <td>${c.nome}</td>
      <td>${c.conta}</td>
      <td>${moeda(c.saldo)}</td>
      <td><span class='linklike' onclick='abrirClienteDetalhe(${i})'>Abrir</span></td>
    </tr>`;
  });
  html+="</table>";
  document.getElementById("conteudo").innerHTML=html;
}

function abrirClienteDetalhe(i){
  const c=clientes[i];
  document.getElementById("titulo").textContent=`Cliente — ${c.nome}`;
  let html=`
    <div class='row'>
      <div class='col'>
        <div class='label'>Nome</div><div class='value'>${c.nome}</div>
        <div class='label'>CPF</div><div class='value'>${c.cpf}</div>
        <div class='label'>E-mail (login)</div><div class='value'>${c.email}</div>
        <div class='label'>Pix</div><div class='value'>${c.pix||'-'}</div>
        <div class='label'>Status</div><div class='value'>${c.status}</div>
      </div>
      <div class='col'>
        <div class='label'>Banco</div><div class='value'>001</div>
        <div class='label'>Agência</div><div class='value'>${c.agencia}</div>
        <div class='label'>Conta</div><div class='value'>${c.conta}</div>
        <div class='label'>Saldo</div><div class='value'>${moeda(c.saldo)}</div>
        <button class='btn small' onclick='abrirEditarCliente(${i})'>Editar</button>
        <button class='btn small' onclick='resetarSenha(${i})'>Resetar senha</button>
      </div>
    </div>
    <h3 style='margin-top:20px;'>Extrato do Cliente</h3>
  `;
  if(c.extrato.length===0){
    html += "<p>Sem movimentações.</p>";
  } else {
    html += "<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>De</th><th>Para</th><th>Valor</th><th>Status</th></tr>";
    c.extrato.slice().reverse().forEach(t=>{
      html+=`<tr>
        <td>${formatDate(new Date(t.data))}</td>
        <td>${t.tipo}</td>
        <td>${t.de}</td>
        <td>${t.para}</td>
        <td>${moeda(t.valor)}</td>
        <td><span class='badge'>${t.status}</span></td>
      </tr>`;
    });
    html+="</table>";
  }
  html += "<p><br><span class='linklike' onclick='abrirClientesAdmin()'>◀ Voltar à lista</span></p>";
  document.getElementById("conteudo").innerHTML=html;
}

function abrirEditarCliente(i){
  const c=clientes[i];
  document.getElementById("titulo").textContent=`Editar Cliente — ${c.nome}`;
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarEdicaoCliente(${i});">
      <div><label>Nome</label><input id="edNome" value="${c.nome}" required /></div>
      <div><label>Email</label><input id="edEmail" type="email" value="${c.email}" required /></div>
      <div><label>Pix</label><input id="edPix" value="${c.pix||''}" /></div>
      <div><label>Status</label>
        <select id="edStatus">
          <option ${c.status==='ATIVA'?'selected':''}>ATIVA</option>
          <option ${c.status==='BLOQUEADA'?'selected':''}>BLOQUEADA</option>
        </select>
      </div>
      <button class="btn" type="submit">Salvar</button>
      <button class="btn" type="button" onclick="abrirClienteDetalhe(${i})">Cancelar</button>
    </form>
  `;
}
function salvarEdicaoCliente(i){
  const c=clientes[i];
  c.nome=document.getElementById("edNome").value;
  c.email=document.getElementById("edEmail").value;
  c.pix=document.getElementById("edPix").value;
  c.status=document.getElementById("edStatus").value;
  alert("Dados atualizados.");
  abrirClienteDetalhe(i);
}
function resetarSenha(i){
  const c=clientes[i];
  c.senha=Math.random().toString(36).slice(-8);
  alert(`Nova senha de ${c.nome}: ${c.senha} (simulado envio por e-mail).`);
}

// Criar novo cliente (Admin)
function abrirCriarClienteAdmin(){
  document.getElementById("titulo").textContent="Criar Novo Cliente (Admin)";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarNovoClienteAdmin();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Email</label><input id="novoEmail" type="email" required /></div>
      <div><label>CPF</label><input id="novoCPF" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <div><label>Saldo Inicial</label><input id="novoSaldo" type="number" value="1000" /></div>
      <button class="btn" type="submit">Salvar</button>
    </form>`;
}
function salvarNovoClienteAdmin(){
  const nome=document.getElementById("novoNome").value;
  const email=document.getElementById("novoEmail").value;
  const cpf=document.getElementById("novoCPF").value;
  const pix=document.getElementById("novoPix").value;
  const saldo=parseFloat(document.getElementById("novoSaldo").value||0);
  if(saldo>cofreAgencia){ alert("Cofre insuficiente para este saldo inicial."); return; }
  criarCliente(nome,email,cpf,pix,saldo,false);
  abrirClientesAdmin();
}

// ===== Transações (Admin) =====
function abrirTransacoesAdmin(){
  document.getElementById("titulo").textContent="Histórico de Transações";
  if(transacoes.length===0){
    document.getElementById("conteudo").innerHTML="<p>Sem transações até o momento.</p>";
    return;
  }
  let html="<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>De</th><th>Para</th><th>Valor</th><th>Status</th></tr>";
  transacoes.slice().reverse().forEach(t=>{
    html+=`<tr>
      <td>${formatDate(new Date(t.data))}</td>
      <td>${t.tipo}</td>
      <td>${t.de}</td>
      <td>${t.para}</td>
      <td>${moeda(t.valor)}</td>
      <td><span class='badge'>${t.status}</span></td>
    </tr>`;
  });
  html+="</table>";
  document.getElementById("conteudo").innerHTML=html;
}

// ===== Cliente — dashboard, transferência e extrato =====
function abrirDashboardCliente(){
  document.getElementById("titulo").textContent="Infinity Fiber Digital";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>Bem-vindo, ${usuarioLogado.nome}</h3>
      <p>Banco 001 — Agência ${usuarioLogado.agencia} — Conta ${usuarioLogado.conta}</p>
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">${moeda(usuarioLogado.saldo)}</p>
    </div>
    <div class="card-grid">
      <div class="card" onclick="abrirTransferenciaCliente()"><div class="card-icon">💸</div><div>Transferir</div></div>
      <div class="card" onclick="abrirExtratoCliente()"><div class="card-icon">📜</div><div>Extrato</div></div>
    </div>`;
}

function abrirTransferenciaCliente(){
  document.getElementById("titulo").textContent="Transferência";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); enviarTransferencia();">
      <div><label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div><label>Destinatário (email cadastrado)</label><input id="destEmail" required /></div>
      <div><label>Valor (R$)</label><input id="valor" type="number" required /></div>
      <div><label>Descrição (opcional)</label><textarea id="descricao"></textarea></div>
      <button class="btn" type="submit">Enviar</button>
      <p id="mensagem"></p>
    </form>`;
}
function enviarTransferencia(){
  const tipo=document.getElementById("tipo").value;
  const destEmail=document.getElementById("destEmail").value;
  const valor=parseFloat(document.getElementById("valor").value||0);
  const descricao=document.getElementById("descricao").value;
  const msg=document.getElementById("mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  if(usuarioLogado.saldo < valor){ msg.textContent="Saldo insuficiente."; return; }
  const destinatario=clientes.find(c=>c.email===destEmail);
  if(!destinatario){ msg.textContent="Destinatário não encontrado."; return; }
  if(destinatario.email===usuarioLogado.email){ msg.textContent="Não é possível transferir para si mesmo."; return; }
  const agora=new Date();
  let status="concluída";
  if(tipo==="PIX"){
    usuarioLogado.saldo -= valor; destinatario.saldo += valor;
  } else {
    const hora=agora.getHours();
    const permitido = isBusinessDay(agora) && ((tipo==="TED" && hora<17) || (tipo==="DOC" && hora<22));
    if(permitido){ usuarioLogado.saldo -= valor; destinatario.saldo += valor; }
    else { status = "agendada"; }
  }
  const registro={ data:agora.toISOString(), tipo, valor, de:usuarioLogado.email, para:destinatario.email, status, descricao };
  transacoes.push(registro);
  usuarioLogado.extrato.push({...registro});
  if(status==="concluída"){ destinatario.extrato.push({...registro}); }
  msg.textContent = status==="concluída" ? `${tipo} de ${moeda(valor)} realizado com sucesso.` : `${tipo} agendado para o próximo dia útil.`;
}
function abrirExtratoCliente(){
  document.getElementById("titulo").textContent="Extrato";
  const movs = usuarioLogado.extrato.slice().reverse();
  if(movs.length===0){ document.getElementById("conteudo").innerHTML="<p>Sem movimentações.</p>"; return; }
  let html="<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>De</th><th>Para</th><th>Valor</th><th>Status</th></tr>";
  movs.forEach(t=>{
    html+=`<tr>
      <td>${formatDate(new Date(t.data))}</td>
      <td>${t.tipo}</td>
      <td>${t.de}</td>
      <td>${t.para}</td>
      <td>${moeda(t.valor)}</td>
      <td><span class='badge'>${t.status}</span></td>
    </tr>`;
  });
  html+="</table>";
  document.getElementById("conteudo").innerHTML=html;
}

// ===== Inicialização =====
window.onload=function(){ inicializarClientes(); };
