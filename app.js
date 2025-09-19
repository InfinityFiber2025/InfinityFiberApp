// ===== Banco Digital Infinity Fiber — v5.3 (sem exibir versão na UI) =====
// Novidades: Saldo a compensar, comprovante (PNG), exportar CSV, cancelar pendente

// ===== Estado & Config =====
let clientes = [];
let nextConta=1;
let usuarioLogado=null;
let tipoLogado=null; // "admin" | "cliente"
let cofreAgencia = 50000000; // R$ 50 milhões
let transacoes = []; // histórico global
let adminPerfil = { selfie:null, nome:'Administrador DanielKascher' };

const CONFIG = {
  janelaBancaria: { inicio:10, fim:16 },
  banco:'001', agencia:'0001'
};

// ===== Utils =====
const $ = sel => document.querySelector(sel);
const moeda = v => 'R$ ' + Number(v).toLocaleString();
const formatDate = d => d.toLocaleString();
const gerarSenha = (n=8) => Math.random().toString(36).slice(-n);
const isBusinessDay = (date)=> { const d=date.getDay(); return d!==0 && d!==6; };
const nextBusinessDay = (date)=>{ const r=new Date(date); do{ r.setDate(r.getDate()+1);}while(!isBusinessDay(r)); return r; };
const dentroJanela = (date)=> {
  if(!isBusinessDay(date)) return false;
  const h=date.getHours();
  return h>=CONFIG.janelaBancaria.inicio && h<CONFIG.janelaBancaria.fim;
};
const uid = ()=> (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2);

// ===== Seed clientes & agendamentos iniciais =====
function inicializarClientes(){
  criarCliente("Maria Thereza Caldas Braga","maria@teste.com","08819784777","00625901703",0,true,null);
  criarCliente("Gustavo Caldas Braga","gustavo@teste.com","00625901703","00625901703",0,true,null);
  criarCliente("Daniel Braga Kascher","daniel@teste.com","05379292666","danielkascher@hotmail.com",0,true,null);
  criarAgendamentoInicial200k();
}
function criarCliente(nome,email,cpf,pix,valorInicial,preCadastro=false,fotoDataUrl=null){
  const conta = String(nextConta).padStart(6,'0'); nextConta++;
  const senha = gerarSenha(8);
  const obj = { nome,email,senha,cpf,banco:CONFIG.banco,agencia:CONFIG.agencia,conta,pix,
    saldo:valorInicial, // disponível
    saldoCompensar:0,   // novo: saldo aguardando janela
    extrato:[],status:'ATIVA',foto:fotoDataUrl };
  clientes.push(obj);
  if(!preCadastro) alert(`Cliente criado: Agência ${CONFIG.agencia} Conta ${conta}. Senha enviada para ${email}: ${senha}`);
}
// cria 200k para cada cliente com status pendente de aprovação e janela bancária
function criarAgendamentoInicial200k(){
  const agora = new Date();
  const d = nextBusinessDay(agora);
  d.setHours(CONFIG.janelaBancaria.inicio,0,0,0);
  clientes.forEach(c=>{
    const t = {
      id: uid(),
      data: agora.toISOString(),
      tipo: 'CRÉDITO INICIAL',
      valor: 200000,
      de: 'Infinity Fiber Bank',
      para: c.email,
      status: 'pendente_aprovacao', // pendente_aprovacao -> aprovada_aguardando -> concluída/cancelada
      scheduledFor: d.toISOString(),
      meta: { requiresAdminApproval: true, adminApproved:false }
    };
    transacoes.push(t);
  });
}

// ===== Navegação Principal =====
function abrirLoginAdmin(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Administrador</h2>
    <form class="form" onsubmit="event.preventDefault(); loginAdmin()">
      <div><label>Usuário</label><input id="adminUser" value="DanielKascher" /></div>
      <div><label>Senha</label><input type="password" id="adminPass" value="K@scher123" /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center'><button class="btn ghost" onclick="location.reload()">Voltar</button></p>`;
}
function abrirBemVindoCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>App do Cliente</h2>
    <div class="login-options">
      <button class="btn" onclick="abrirLoginCliente()">Já sou cliente</button>
      <button class="btn ghost" onclick="abrirCadastroCliente()">Não sou cliente</button>
      <p style="opacity:.8;margin-top:8px;">Banco ${CONFIG.banco} — Agência ${CONFIG.agencia}</p>
    </div>
    <p style='text-align:center'><button class="btn" onclick="location.reload()">Voltar</button></p>`;
}
function voltarDashboard(){ if(tipoLogado==='admin') abrirDashboardAdmin(); else abrirDashboardCliente(); }

// ===== Login/Admin =====
function loginAdmin(){
  const u=$("#adminUser").value, p=$("#adminPass").value;
  if(u==='DanielKascher' && p==='K@scher123'){
    tipoLogado='admin'; usuarioLogado={nome:adminPerfil.nome};
    $("#loginTela").style.display='none'; $("#app").style.display='block'; abrirDashboardAdmin();
  } else alert('Usuário ou senha inválidos.');
}
function abrirDashboardAdmin(){
  $("#titulo").textContent="Back Office — Infinity Fiber";
  $("#conteudo").innerHTML=`
    <div class='card-grid'>
      <div class='card' onclick='abrirCofre()'><div class='card-icon'>🏦</div><div>Cofre da Agência</div></div>
      <div class='card' onclick='abrirClientesAdmin()'><div class='card-icon'>👥</div><div>Clientes</div></div>
      <div class='card' onclick='abrirTransacoesAdmin()'><div class='card-icon'>🔄</div><div>Transações</div></div>
      <div class='card' onclick='abrirCriarClienteAdmin()'><div class='card-icon'>➕</div><div>Novo Cliente</div></div>
    </div>`;
}
function abrirCofre(){
  $("#titulo").textContent="Cofre da Agência";
  const totalComp = clientes.reduce((acc,c)=> acc + (c.saldoCompensar||0), 0);
  $("#conteudo").innerHTML=`<h3>Saldo do Cofre: ${moeda(cofreAgencia)}</h3>
  <p>Banco ${CONFIG.banco} — Agência ${CONFIG.agencia}</p>
  <p>Compromissos aprovados (a compensar): <strong>${moeda(totalComp)}</strong></p>`;
}

// ===== Admin: Clientes =====
function abrirClientesAdmin(){
  $("#titulo").textContent="Clientes";
  let html="<table class='table'><tr><th>Cliente</th><th>Conta</th><th>Saldo</th><th>A compensar</th><th>Status</th></tr>";
  clientes.forEach(c=>{
    html+=`<tr>
      <td><div class='media'><img class='avatar' src='${c.foto||""}' onerror="this.style.display='none'"/><div>${c.nome}<div style='opacity:.75;font-size:12px;'>${c.email}</div></div></div></td>
      <td>${c.conta}</td><td>${moeda(c.saldo)}</td><td>${moeda(c.saldoCompensar||0)}</td><td><span class='badge'>${c.status}</span></td>
    </tr>`;
  });
  html+="</table>";
  $("#conteudo").innerHTML=html;
}
function abrirCriarClienteAdmin(){
  $("#titulo").textContent="Criar Novo Cliente (Admin)";
  $("#conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarNovoClienteAdmin();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Email</label><input id="novoEmail" type="email" required /></div>
      <div><label>CPF</label><input id="novoCPF" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <button class="btn" type="submit">Salvar</button>
    </form>`;
}
function salvarNovoClienteAdmin(){
  const nome=$("#novoNome").value, email=$("#novoEmail").value, cpf=$("#novoCPF").value, pix=$("#novoPix").value;
  criarCliente(nome,email,cpf,pix,0,false,null);
  abrirClientesAdmin();
}

// ===== Admin: Transações (biometria + cancelar + liquidar) =====
function abrirTransacoesAdmin(){
  $("#titulo").textContent="Transações";
  const pendentes = transacoes.filter(t=>t.status==='pendente_aprovacao');
  const aprovadas = transacoes.filter(t=>t.status==='aprovada_aguardando');
  const concluidas = transacoes.filter(t=>t.status==='concluída');
  const canceladas = transacoes.filter(t=>t.status==='cancelada');

  const linhaPend = (t)=>`<tr>
    <td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td><td>${moeda(t.valor)}</td>
    <td><span class="badge warn">Pendente de aprovação</span></td>
    <td>${t.scheduledFor?formatDate(new Date(t.scheduledFor)):'-'}</td>
    <td>
      <button class="btn small" onclick="aprovarTransacaoBiometria('${t.id}')">Aprovar por Biometria</button>
      <button class="btn small danger" onclick="cancelarTransacao('${t.id}')">Cancelar</button>
    </td>
  </tr>`;
  const linhaApr = (t)=>`<tr>
    <td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td><td>${moeda(t.valor)}</td>
    <td><span class="badge">Aprovada — aguardando janela</span></td>
    <td>${t.scheduledFor?formatDate(new Date(t.scheduledFor)):'-'}</td>
    <td>-</td>
  </tr>`;
  const linhaConc = (t)=>`<tr>
    <td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td><td>${moeda(t.valor)}</td>
    <td><span class="badge ok">Concluída</span></td>
    <td>${formatDate(new Date(t.data))}</td>
    <td><button class="btn small" onclick="gerarComprovante('${t.id}')">Comprovante</button></td>
  </tr>`;
  const linhaCanc = (t)=>`<tr>
    <td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td><td>${moeda(t.valor)}</td>
    <td><span class="badge danger">Cancelada</span></td>
    <td>${formatDate(new Date(t.data))}</td>
    <td>-</td>
  </tr>`;

  $("#conteudo").innerHTML = `
    <h3>Pendentes de Aprovação</h3>
    <table class="table"><tr><th>Tipo</th><th>Origem</th><th>Destino</th><th>Valor</th><th>Status</th><th>Agendada p/</th><th>Ação</th></tr>
    ${pendentes.map(linhaPend).join('') || '<tr><td colspan="7">Nenhuma pendente.</td></tr>'}</table>

    <h3>Aprovadas (Aguardando Janela Bancária)</h3>
    <table class="table"><tr><th>Tipo</th><th>Origem</th><th>Destino</th><th>Valor</th><th>Status</th><th>Agendada p/</th><th>Ação</th></tr>
    ${aprovadas.map(linhaApr).join('') || '<tr><td colspan="7">Nenhuma.</td></tr>'}</table>

    <h3>Concluídas</h3>
    <table class="table"><tr><th>Tipo</th><th>Origem</th><th>Destino</th><th>Valor</th><th>Status</th><th>Data/Hora</th><th></th></tr>
    ${concluidas.map(linhaConc).join('') || '<tr><td colspan="7">Nenhuma.</td></tr>'}
    </table>

    <h3>Canceladas</h3>
    <table class="table"><tr><th>Tipo</th><th>Origem</th><th>Destino</th><th>Valor</th><th>Status</th><th>Data/Hora</th><th></th></tr>
    ${canceladas.map(linhaCanc).join('') || '<tr><td colspan="7">Nenhuma.</td></tr>'}
    </table>

    <p><button class="btn small" onclick="rodarLiquidacaoAgora()">Forçar liquidação</button></p>
  `;
}
async function aprovarTransacaoBiometria(id){
  const t = transacoes.find(x=>x.id===id);
  if(!t) return;
  $("#conteudo").insertAdjacentHTML('beforeend',`
    <div class="modal" id="modalBio">
      <div class="modal-card">
        <h3>Aprovação biométrica do Administrador</h3>
        <p style="opacity:.85">Capture a selfie para autorizar a transação de ${moeda(t.valor)} para ${t.para}.</p>
        <video id="videoAdmin" class="camera" autoplay playsinline></video>
        <canvas id="canvasAdmin" class="canvas"></canvas>
        <div class="modal-actions">
          <button class="btn ghost" onclick="fecharModalBio()">Cancelar</button>
          <button class="btn" onclick="capturarAdminEaprovar('${id}')">Capturar & Aprovar</button>
        </div>
      </div>
    </div>`);
  try{
    const s = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    $("#videoAdmin").srcObject=s;
  }catch(e){ alert("Não foi possível acessar a câmera."); fecharModalBio(); }
}
function fecharModalBio(){
  const v=$("#videoAdmin"); const st=v && v.srcObject;
  if(st){ st.getTracks().forEach(t=>t.stop()); }
  const m=$("#modalBio"); if(m) m.remove();
}
function capturarAdminEaprovar(id){
  const v=$("#videoAdmin"), c=$("#canvasAdmin");
  c.width=v.videoWidth||320; c.height=v.videoHeight||240;
  c.getContext('2d').drawImage(v,0,0,c.width,c.height);
  adminPerfil.selfie = c.toDataURL('image/png');
  fecharModalBio();
  const t = transacoes.find(x=>x.id===id);
  if(!t) return;
  // marca aprovada e credita como "saldo a compensar" no cliente
  t.status='aprovada_aguardando';
  t.meta.adminApproved=true;
  const dest = clientes.find(c=>c.email===t.para);
  if(dest){ dest.saldoCompensar = (dest.saldoCompensar||0) + t.valor; }
  alert("Transação aprovada. Ela liquidará automaticamente na janela bancária.");
  abrirTransacoesAdmin();
}
function cancelarTransacao(id){
  const t = transacoes.find(x=>x.id===id);
  if(!t) return;
  if(!confirm("Confirmar cancelamento desta transação?")) return;
  t.status='cancelada';
  t.data = new Date().toISOString();
  abrirTransacoesAdmin();
}

// ===== Liquidação =====
function liquidarAgendadas(now){
  transacoes.forEach(t=>{
    if(t.status==='aprovada_aguardando' && t.scheduledFor){
      const quando = new Date(t.scheduledFor);
      if(now>=quando && dentroJanela(now)){
        const dest = clientes.find(c=>c.email===t.para);
        if(dest && dest.status==='ATIVA'){
          // mover do a compensar para disponível
          const valor = t.valor;
          dest.saldoCompensar = Math.max(0, (dest.saldoCompensar||0) - valor);
          dest.saldo += valor;
          // extrato
          const mov = { data: new Date().toISOString(), tipo:t.tipo, de:t.de, para:t.para, valor:valor, status:'concluída', txid: uid().slice(0,10) };
          dest.extrato.push(mov);
          t.status='concluída';
          t.data = new Date().toISOString();
          t.txid = mov.txid;
          // Cofre diminui
          cofreAgencia -= valor;
        }
      }
    }
  });
}
function rodarLiquidacaoAgora(){
  liquidarAgendadas(new Date());
  abrirTransacoesAdmin();
}
setInterval(()=> liquidarAgendadas(new Date()), 60000);

// ===== Comprovante (PNG via Canvas) =====
function gerarComprovante(id){
  const t = transacoes.find(x=>x.id===id);
  if(!t || t.status!=='concluída') return alert("Transação não concluída.");
  const dest = clientes.find(c=>c.email===t.para);
  const canvas = document.createElement('canvas');
  canvas.width = 900; canvas.height = 500;
  const ctx = canvas.getContext('2d');
  // fundo
  const g = ctx.createLinearGradient(0,0,900,0);
  g.addColorStop(0,'#001a42'); g.addColorStop(1,'#0b1c3a');
  ctx.fillStyle = g; ctx.fillRect(0,0,900,500);
  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Banco Digital Infinity Fiber', 30, 50);
  ctx.font = 'bold 22px Arial'; ctx.fillText('Comprovante de Crédito', 30, 90);
  ctx.fillStyle = 'white'; ctx.font='16px Arial';
  const linhas = [
    'Origem: Infinity Fiber Bank (001/0001)',
    `Destino: ${dest ? dest.nome : t.para}`,
    `Conta: ${dest ? dest.conta : '-'}`,
    `Valor: ${moeda(t.valor)}`,
    `Data/Hora: ${formatDate(new Date(t.data))}`,
    `Autenticação: ${t.txid || uid().slice(0,10)}`
  ];
  let y = 140;
  linhas.forEach(l=>{ ctx.fillText(l, 30, y); y+=32; });
  // borda
  ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth=2; ctx.strokeRect(20,20,860,460);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url; a.download = `comprovante_${t.txid||'transacao'}.png`;
  a.click();
}

// ===== Cliente (login/cadastro/perfil/extrato/CSV) =====
function abrirLoginCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Cliente</h2>
    <form class="form" onsubmit="event.preventDefault(); loginCliente()">
      <div><label>Email</label><input id="loginEmail" required /></div>
      <div><label>Senha</label><input type="password" id="loginSenha" required /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center'><button class="btn ghost" onclick="abrirBemVindoCliente()">Voltar</button></p>`;
}
function loginCliente(){
  const email=$("#loginEmail").value, senha=$("#loginSenha").value;
  const c=clientes.find(x=>x.email===email && x.senha===senha);
  if(!c){ alert("Email ou senha inválidos."); return; }
  if(c.status!=='ATIVA'){ alert("Conta bloqueada."); return; }
  usuarioLogado=c; tipoLogado='cliente';
  $("#loginTela").style.display='none'; $("#app").style.display='block'; abrirDashboardCliente();
}
let stream=null;
async function abrirCadastroCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Abrir Conta</h2>
    <form class="form" onsubmit="event.preventDefault(); salvarCadastroCliente()">
      <div><label>Nome</label><input id="cadNome" required /></div>
      <div><label>E-mail</label><input id="cadEmail" type="email" required /></div>
      <div><label>CPF</label><input id="cadCPF" required /></div>
      <div><label>Pix</label><input id="cadPix" /></div>
      <div><label>Selfie</label>
        <video id="video" class="camera" autoplay playsinline></video>
        <canvas id="canvas" class="canvas"></canvas>
        <div style="margin-top:8px;"><button class="btn small" type="button" onclick="capturarSelfie()">Capturar selfie</button></div>
        <img id="previewSelfie" class="avatar" style="margin-top:8px; display:none;" />
      </div>
      <button class="btn" type="submit">Criar conta</button>
    </form>
    <p style='text-align:center'><button class="btn ghost" onclick="abrirBemVindoCliente()">Voltar</button></p>`;
  try{ stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false}); $("#video").srcObject=stream; }catch(e){}
}
function capturarSelfie(){
  const v=$("#video"), c=$("#canvas");
  c.width=v.videoWidth||320; c.height=v.videoHeight||240;
  c.getContext('2d').drawImage(v,0,0,c.width,c.height);
  const data=c.toDataURL('image/png');
  const img=$("#previewSelfie"); img.src=data; img.style.display='inline-block'; img.dataset.selfie=data;
}
function salvarCadastroCliente(){
  const nome=$("#cadNome").value, email=$("#cadEmail").value, cpf=$("#cadCPF").value, pix=$("#cadPix").value;
  const foto=$("#previewSelfie")?.dataset?.selfie || null;
  criarCliente(nome,email,cpf,pix,0,false,foto);
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  alert("Conta criada! Sua senha foi enviada por e-mail (simulação).");
  location.reload();
}

function abrirDashboardCliente(){
  $("#titulo").textContent="Infinity Fiber — Cliente";
  const foto = usuarioLogado.foto ? `<img class='avatar' src='${usuarioLogado.foto}'/>` : `<div class='avatar'></div>`;
  $("#conteudo").innerHTML=`
    <div class='media' style='justify-content:center;'>${foto}<div>
      <div style='font-weight:700'>${usuarioLogado.nome}</div>
      <div style='opacity:.8;font-size:12px'>Banco ${CONFIG.banco} • Agência ${usuarioLogado.agencia} • Conta ${usuarioLogado.conta}</div>
    </div></div>
    <div style="text-align:center;margin-top:10px;">
      <div class="row" style="justify-content:center;">
        <div class="col" style="max-width:320px;">
          <div class='label'>Saldo disponível</div>
          <div style="font-size:28px; font-weight:bold;">${moeda(usuarioLogado.saldo)}</div>
        </div>
        <div class="col" style="max-width:320px;">
          <div class='label'>Saldo a compensar</div>
          <div style="font-size:28px; font-weight:bold;">${moeda(usuarioLogado.saldoCompensar||0)}</div>
        </div>
      </div>
    </div>
    <div class="card-grid">
      <div class="card" onclick="abrirExtratoCliente()"><div class="card-icon">📜</div><div>Extrato</div></div>
      <div class="card" onclick="baixarExtratoCSV()"><div class="card-icon">⬇️</div><div>Exportar CSV</div></div>
      <div class="card" onclick="abrirPerfilCliente()"><div class="card-icon">👤</div><div>Meu Perfil</div></div>
    </div>`;
}
function abrirExtratoCliente(){
  $("#titulo").textContent="Extrato";
  const movs = usuarioLogado.extrato;
  let html = "<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>Origem</th><th>Valor</th><th>Status</th></tr>";
  if(!movs.length){ html += "<tr><td colspan='5'>Sem movimentações.</td></tr>"; }
  movs.slice().reverse().forEach(t=>{
    html += `<tr><td>${formatDate(new Date(t.data))}</td><td>${t.tipo}</td><td>${t.de}</td><td>${moeda(t.valor)}</td><td><span class='badge ok'>${t.status}</span></td></tr>`;
  });
  html += "</table>";
  $("#conteudo").innerHTML = html + `<p><span class='linklike' onclick='abrirDashboardCliente()'>◀ Voltar</span></p>`;
}
function baixarExtratoCSV(){
  const movs = usuarioLogado.extrato || [];
  const linhas = [["data_hora","tipo","origem","destino","valor","status","txid"]];
  movs.forEach(m=>{
    linhas.push([new Date(m.data).toISOString(), m.tipo, m.de, m.para||"", m.valor, m.status, m.txid||""]);
  });
  const csv = linhas.map(r=> r.map(x=> `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`extrato_${usuarioLogado.conta}.csv`; a.click();
  URL.revokeObjectURL(url);
}
function abrirPerfilCliente(){
  $("#titulo").textContent="Meu Perfil";
  $("#conteudo").innerHTML=`
    <div class='row'>
      <div class='col'>
        <div class='label'>Nome</div><div class='value'>${usuarioLogado.nome}</div>
        <div class='label'>E-mail</div><div class='value'>${usuarioLogado.email}</div>
        <div class='label'>CPF</div><div class='value'>${usuarioLogado.cpf}</div>
        <div class='label'>Pix</div><div class='value'>${usuarioLogado.pix||'-'}</div>
      </div>
      <div class='col'>
        <div class='label'>Foto/Selfie</div>
        ${usuarioLogado.foto?`<img class='avatar' src='${usuarioLogado.foto}'/>`:'<div class="avatar"></div>'}
      </div>
    </div>
    <p><span class='linklike' onclick='abrirDashboardCliente()'>◀ Voltar</span></p>`;
}

// ===== PWA =====
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }

// ===== Inicialização =====
window.onload = function(){ inicializarClientes(); };
