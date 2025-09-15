// Estado global
const LS_KEY='if_bank_v2';
const fmtBRL=n=>(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const now=()=>new Date();
const fmtDT=d=>new Date(d).toLocaleString('pt-BR');
function defState(){return{
  usuario:{login:'DanielKascher',senha:'K@scher123',nome:'Daniel Kascher'},
  conta:{banco:'Infinity Fiber',agencia:'0001',numero:'123456-7'},
  saldo:5000000000,
  extrato:[{dt:now(),tipo:'Crédito',desc:'Saldo inicial (ambiente de testes)',valor:5000000000}],
  notificacoes:[{dt:now(),text:'Conta aprovada via reconhecimento facial'}],
  clientes:[], // lista de clientes cadastrados
  cartao:null,
  config:{}
};}
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||defState();}catch(e){return defState();}}
function save(){localStorage.setItem(LS_KEY, JSON.stringify(S));}
let S = load();

// Auxiliares
function go(h){window.location.href=h;}
function ensureAuth(){ if(sessionStorage.getItem('logado')!=='1') go('index.html'); }
function pushMov(tipo,desc,valor){ S.extrato.unshift({dt:now(),tipo,desc,valor}); S.saldo=(S.saldo||0)+(valor||0); save(); }
function notify(text){ S.notificacoes.unshift({dt:now(),text}); save(); }
const BANKS=['Banco do Brasil','Itaú','Bradesco','Caixa','Santander','Nubank','BTG Pactual','C6 Bank','Inter','Mercado Pago'];

// Login
function doLogin(){
  const u=document.getElementById('usuario').value;
  const p=document.getElementById('senha').value;
  if(u===S.usuario.login && p===S.usuario.senha){ sessionStorage.setItem('logado','1'); go('home.html'); }
  else alert('Usuário ou senha inválidos.');
}

// Cadastro + Facial
function avancarFacial(){
  const novo={
    nome: byId('c_nome').value.trim(),
    cpf: byId('c_cpf').value.trim(),
    email: byId('c_email').value.trim(),
    tel: byId('c_tel').value.trim()
  };
  if(!novo.nome||!novo.cpf){ alert('Nome e CPF são obrigatórios.'); return; }
  sessionStorage.setItem('novo_cliente', JSON.stringify(novo));
  go('facial.html');
}
async function ativarCamera(videoEl){
  try{
    const st = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    videoEl.srcObject = st;
    return st;
  }catch(e){ alert('Erro ao acessar a câmera: '+e.message); return null; }
}
function aprovarConta(stream){
  const novo = JSON.parse(sessionStorage.getItem('novo_cliente')||'{}');
  if(!novo.nome){ alert('Dados não encontrados.'); return; }
  const contaNum = String(Math.floor(100000+Math.random()*899999))+'-7';
  const cliente = { ...novo, agencia:'0001', conta:contaNum };
  // Se for o primeiro cliente, torna-se titular atual
  S.clientes = [cliente, ...S.clientes];
  S.usuario.nome = cliente.nome;
  S.conta.numero = cliente.conta;
  S.saldo = 5000000000;
  S.extrato = [{dt:now(),tipo:'Crédito',desc:'Saldo inicial (ambiente de testes)',valor:5000000000}];
  S.notificacoes.unshift({dt:now(),text:'Conta aprovada via reconhecimento facial'});
  save();
  if(stream){ stream.getTracks().forEach(t=>t.stop()); }
  sessionStorage.setItem('logado','1');
  alert('Conta aprovada! Agência 0001 • Conta '+contaNum);
  go('home.html');
}

// Transferência
function renderRemetente(domId){
  const el = byId(domId);
  if(!S.clientes.length){
    el.innerHTML = `<div class="small">⚠️ Nenhum cliente encontrado. Cadastre um cliente antes de transferir.</div>
    <div class="toolbar"><button class="btn secondary" onclick="go('cadastro.html')">Cadastrar Cliente</button></div>`;
    return false;
  }else{
    const c = S.clientes[0]; // remetente atual (simples)
    el.innerHTML = `<div class="badge">Remetente: ${c.nome} • Ag ${c.agencia} • Cc ${c.conta}</div>`;
    return true;
  }
}
function buscarCliente(){
  if(!S.clientes.length){ alert('Nenhum cliente cadastrado.'); return; }
  const nomes = S.clientes.map((c,i)=>`${i+1}. ${c.nome} • ${c.agencia}/${c.conta}`).join('\n');
  const idx = prompt('Selecione o cliente:\n'+nomes+'\n\nDigite o número da lista:');
  const n = parseInt(idx||'1')-1;
  if(S.clientes[n]){
    // colocar selecionado no topo (remetente atual)
    const sel = S.clientes.splice(n,1)[0];
    S.clientes.unshift(sel); save();
    alert('Cliente selecionado: '+sel.nome);
    renderRemetente('remetenteBox');
  }
}
function enviarTED(){
  if(!S.clientes.length){ alert('Cadastre cliente antes.'); return; }
  const banco = byId('banco').value;
  const ag = byId('ag').value.trim();
  const cc = byId('cc').value.trim();
  const fav = byId('fav').value.trim();
  const v = parseFloat(byId('valTed').value||'0');
  if(!banco||!ag||!cc||!fav||v<=0) return alert('Preencha todos os campos da TED.');
  if(S.saldo < v) return alert('Saldo insuficiente.');
  pushMov('Transferência TED', `Para ${banco} • Ag ${ag} • Cc ${cc} • Fav ${fav}`, -v);
  notify(`TED enviada para ${banco}: ${fmtBRL(v)}`);
  alert('TED enviada!'); go('saldo.html');
}
function enviarPIX(){
  if(!S.clientes.length){ alert('Cadastre cliente antes.'); return; }
  const tipo = byId('tipoPix').value;
  const chave = byId('chavePix').value.trim();
  const v = parseFloat(byId('valPix').value||'0');
  if(!chave||v<=0) return alert('Preencha a chave PIX e o valor.');
  if(S.saldo < v) return alert('Saldo insuficiente.');
  pushMov('Transferência PIX', `Chave (${tipo}) ${chave}`, -v);
  notify(`PIX enviado: ${fmtBRL(v)}`);
  alert('PIX enviado!'); go('saldo.html');
}

// Pagamentos (resumo)
function pagarBoleto(){
  const l = byId('linha').value.trim();
  const v = parseFloat(byId('valBol').value||'0');
  if(l.length<10||v<=0) return alert('Preencha linha e valor.');
  if(S.saldo<v) return alert('Saldo insuficiente.');
  pushMov('Pagamento','Boleto '+l.slice(0,5)+'…',-v); notify('Boleto pago: '+fmtBRL(v)); alert('Boleto pago!'); go('saldo.html');
}
function pagarPix(){
  const ch = byId('pixChave').value.trim();
  const v = parseFloat(byId('valPix').value||'0');
  if(!ch||v<=0) return alert('Preencha chave e valor.');
  if(S.saldo<v) return alert('Saldo insuficiente.');
  pushMov('Pagamento PIX','Chave '+ch,-v); notify('PIX pago: '+fmtBRL(v)); alert('PIX pago!'); go('saldo.html');
}
function pagarQR(){
  const v=100; if(S.saldo<v) return alert('Saldo insuficiente.');
  pushMov('Pagamento QR','Leitura QR simulada',-v); notify('Pagamento via QR: '+fmtBRL(v)); alert('QR pago!'); go('saldo.html');
}

// Cartões virtuais
function randDigits(n){return Array.from({length:n},()=>Math.floor(Math.random()*10)).join('');}
function chunkPan(p){return p.replace(/(\d{4})(?=\d)/g,'$1 ').trim();}
function genCard(tipo,limite,modo){
  const pan = randDigits(16);
  const cvv = randDigits(3);
  const mm = String(Math.floor(1+Math.random()*12)).padStart(2,'0');
  const yy = String(new Date().getFullYear()+3).slice(-2);
  S.cartao = { tipo, limite, pan, cvv, exp:`${mm}/${yy}`, modo:(modo||'Crédito') };
  save();
  renderCard('vc_wrap', false);
  alert('Cartão '+tipo+' ('+S.cartao.modo+') gerado!');
}
function renderCard(containerId, show=false){
  const el = byId(containerId);
  if(!el) return;
  if(!S.cartao){ el.innerHTML='<div class="small">Nenhum cartão virtual gerado ainda.</div>'; return; }
  const klass = S.cartao.tipo==='Lite' ? 'card-lite' : (S.cartao.tipo==='Black' ? 'card-black' : 'card-unlimited');
  const titular = S.usuario.nome || 'Cliente Infinity';
  const cvv = show ? S.cartao.cvv : '***';
  el.innerHTML = `
  <div class="vcard ${klass}">
    <div class="row2"><div class="brand">∞ Infinity Fiber</div><div class="meta">${S.cartao.modo}</div></div>
    <div class="pan mono">${chunkPan(S.cartao.pan)}</div>
    <div class="row2">
      <div class="meta">Val: ${S.cartao.exp} &nbsp; • &nbsp; CVV: <span id="cvv">${cvv}</span></div>
      <button class="copybtn" onclick="navigator.clipboard.writeText('${S.cartao.pan}')">Copiar número</button>
    </div>
    <div class="row2">
      <div class="name">${titular}</div>
      <button class="copybtn" onclick="toggleCVV()">Mostrar/ocultar CVV</button>
    </div>
  </div>`;
}
function toggleCVV(){ const s = byId('cvv'); if(!s) return; s.textContent = (s.textContent==='***' ? S.cartao.cvv : '***'); }

// Util
function byId(id){return document.getElementById(id);}
