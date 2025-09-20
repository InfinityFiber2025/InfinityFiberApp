
const STORE_KEY='if_admin_state_v6';
const roleCreds = { admin:{u:'DanielKascher',p:'K@scher123',label:'Administrador'}, treasurer:{u:'Tesoureiro',p:'Cofre123',label:'Tesoureiro'} };

const initial = {
  bank:{ vault: 37300000000.00 },
  clients:[
    {id:1,name:'Gustavo Caldas Braga',cpf:'006.259.017-03',active:true,balance:200000},
    {id:2,name:'Maria Thereza Caldas Braga',cpf:'088.197.847-77',active:true,balance:200000},
    {id:3,name:'Daniel Braga Kascher',cpf:'053.792.926-66',active:true,balance:200000},
  ],
  tx:[
    {id:101,from:1,to:2,amount:200000,status:'pending',desc:'PIX 1'},
    {id:102,from:2,to:3,amount:200000,status:'pending',desc:'PIX 2'},
    {id:103,from:3,to:1,amount:200000,status:'pending',desc:'PIX 3'},
  ]
};

function load(){ const s=localStorage.getItem(STORE_KEY); if(!s){ localStorage.setItem(STORE_KEY, JSON.stringify(initial)); return structuredClone(initial); } try{return JSON.parse(s);}catch{ return structuredClone(initial);} }
function save(st){ localStorage.setItem(STORE_KEY, JSON.stringify(st)); }
function br(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

let state = load();
let navStack = [];
const app = document.getElementById('app');

function goto(view, push=true){ if(push && currentView) navStack.push(currentView); currentView=view; render(); }
function back(){ if(navStack.length){ currentView=navStack.pop(); render(); } else { currentView='dashboard'; render(); } }
let currentView = 'login';

function viewLogin(){
  const lastRole = sessionStorage.getItem('if_role') || 'admin';
  return `
  <div class="flex items-center justify-center min-h-screen">
    <div class="card w-[360px] p-6 text-center">
      <div class="mx-auto w-16 h-16 rounded-xl bg-[#111] flex items-center justify-center mb-3">
        <img src="icons/logo.svg" class="w-10 h-10" />
      </div>
      <h1 class="font-extrabold text-xl mb-1">BANCO ADMIN</h1>
      <p class="text-muted mb-4">Acesse com seu perfil</p>
      <label class="text-sm">Perfil</label>
      <select id="role" class="mb-2">
        <option value="admin" ${lastRole==='admin'?'selected':''}>Administrador</option>
        <option value="treasurer" ${lastRole==='treasurer'?'selected':''}>Tesoureiro</option>
      </select>
      <label class="text-sm">Usuário</label>
      <input id="user" class="mb-2" placeholder="DanielKascher ou Tesoureiro"/>
      <label class="text-sm">Senha</label>
      <input id="pass" class="mb-3" type="password" placeholder="••••••••"/>
      <button id="btnLogin" class="btn btn-primary w-full mb-2">Entrar</button>
      <div id="msg" class="text-sm text-muted"></div>
    </div>
  </div>`;
}
function onLoginMount(){
  document.getElementById('btnLogin').onclick = ()=>{
    const role = document.getElementById('role').value;
    const u = document.getElementById('user').value.trim();
    const p = document.getElementById('pass').value;
    if(u===roleCreds[role].u && p===roleCreds[role].p){
      sessionStorage.setItem('if_role', role);
      navStack=[]; goto('dashboard', false);
    } else { document.getElementById('msg').textContent='Credenciais inválidas'; }
  };
}

function shell(inner, title='Dashboard'){
  const role = sessionStorage.getItem('if_role')||'admin';
  return `
  <div class="flex">
    <aside class="w-16 md:w-56 min-h-screen border-r border-[var(--line)] bg-[#0b0c10] p-3">
      <div class="hidden md:flex items-center gap-2 mb-4 text-sm font-bold"><img src="icons/logo.svg" class="w-6 h-6"/> Infinity Fiber</div>
      <nav class="flex flex-col gap-2 text-sm">
        <button data-goto="dashboard" class="btn !py-2">🏠 <span class="hidden md:inline">Dashboard</span></button>
        ${role==='admin'?`<button data-goto="clientes" class="btn !py-2">👤 <span class="hidden md:inline">Clientes</span></button>
        <button data-goto="transacoes" class="btn !py-2">💸 <span class="hidden md:inline">Transações</span></button>`:''}
        ${role==='treasurer'?`<button data-goto="cofre" class="btn !py-2">🏦 <span class="hidden md:inline">Cofre</span></button>`:''}
      </nav>
      <div class="mt-6 text-xs text-muted">Perfil: ${roleCreds[role].label}</div>
      <button id="logout" class="btn mt-3 w-full">Sair</button>
    </aside>
    <main class="flex-1 p-3">
      <div class="flex items-center justify-between mb-3">
        <div class="text-lg font-bold">${title}</div>
        <div class="flex gap-2">
          <button id="backBtn" class="btn hidden md:inline">← Voltar</button>
        </div>
      </div>
      ${inner}
    </main>
  </div>`
}

function viewDashboard(){
  const total = state.clients.reduce((s,c)=>s+Number(c.balance),0);
  const pendentes = state.tx.filter(t=>t.status==='pending').length;
  return shell(`
    <div class="grid md:grid-cols-3 gap-3">
      <div class="card p-4">
        <div class="text-muted text-sm">Clientes</div>
        <div class="text-2xl font-extrabold">${state.clients.length}</div>
        <button data-goto="clientes" class="btn mt-3 w-full">Abrir clientes</button>
      </div>
      <div class="card p-4">
        <div class="text-muted text-sm">Saldo total</div>
        <div class="text-2xl font-extrabold">${br(total)}</div>
        <button data-goto="cofre" class="btn mt-3 w-full">Cofre bancário</button>
      </div>
      <div class="card p-4">
        <div class="text-muted text-sm">Pendentes</div>
        <div class="text-2xl font-extrabold">${pendentes}</div>
        <button data-goto="transacoes" class="btn mt-3 w-full">Ver pendentes</button>
      </div>
    </div>
    <div class="mt-3">
      <button class="btn">Relatórios</button>
    </div>
  `,'Dashboard Inicial');
}

function viewClientes(){
  const rows = state.clients.map(c=>`<tr><td class="py-2">${c.name}</td><td>${c.cpf}</td><td>${br(c.balance)}</td><td>${c.active?'Ativo':'Inativo'}</td></tr>`).join('');
  return shell(`
    <div class="card p-3">
      <div class="flex items-center justify-between mb-2">
        <div class="font-semibold">Clientes</div>
        <button id="btnNovo" class="btn btn-primary !py-1">Cadastrar novo cliente</button>
      </div>
      <table class="table w-full text-sm">
        <thead><tr><th>Nome</th><th>CPF</th><th>Saldo</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `,'Gestão de Clientes');
}

function viewTransacoes(){
  const pen = state.tx.filter(t=>t.status==='pending');
  const apr = state.tx.filter(t=>t.status==='approved');
  const mk = (t)=>{
    const f = state.clients.find(c=>c.id===t.from)?.name || '—';
    const d = state.clients.find(c=>c.id===t.to)?.name || '—';
    return `<li class="card p-3 flex items-center justify-between text-sm">
      <div><b>${f}</b> → ${d}<div class="text-muted">${t.desc}</div></div>
      <div class="flex items-center gap-2"><span class="badge">${br(t.amount)}</span>
      <button class="btn btn-primary !py-1" data-approve="${t.id}">Aprovar</button>
      <button class="btn !py-1" data-reject="${t.id}">Recusar</button></div></li>`;
  };
  const mk2 = (t)=>{
    const f = state.clients.find(c=>c.id===t.from)?.name || '—';
    const d = state.clients.find(c=>c.id===t.to)?.name || '—';
    return `<li class="card p-3 flex items-center justify-between text-sm"><div><b>${f}</b> → ${d}</div><span class="badge">Aprovada</span></li>`;
  };
  return shell(`
    <div class="grid md:grid-cols-2 gap-3">
      <div class="card p-3">
        <div class="font-semibold mb-2">Gestão Transações (Pendentes)</div>
        <ul class="flex flex-col gap-2" id="listPen">${pen.map(mk).join('')||'<div class="text-muted">Nada pendente</div>'}</ul>
      </div>
      <div class="card p-3">
        <div class="font-semibold mb-2">Aguardando Cofre</div>
        <ul class="flex flex-col gap-2" id="listAwa">${
          state.tx.filter(t=>t.status==='awaiting_vault').map(mk).join('')||'<div class="text-muted">Sem filas</div>'}</ul>
        <div class="font-semibold mt-4 mb-2">Aprovadas</div>
        <ul class="flex flex-col gap-2" id="listApr">${apr.map(mk2).join('')||'<div class="text-muted">Sem aprovadas</div>'}</ul>
      </div>
    </div>
  `,'Gestão de Transações');
}

function viewCofre(){
  const list = state.tx.filter(t=>t.status==='awaiting_vault').map(t=>{
    const d = state.clients.find(c=>c.id===t.to)?.name || '—';
    return `<li class="card p-3 flex items-center justify-between text-sm">
      <div>Crédito para <b>${d}</b></div>
      <div class="flex items-center gap-2">
        <span class="badge">${br(t.amount)}</span>
        <button class="btn btn-primary !py-1" data-release="${t.id}">Liberar</button>
        <button class="btn !py-1" data-cancel="${t.id}">Cancelar</button>
      </div>
    </li>`;
  }).join('') || '<div class="text-muted">Sem pendências</div>';
  return shell(`
    <div class="grid md:grid-cols-3 gap-3">
      <div class="card p-4 col-span-1">
        <div class="text-muted text-sm">Cofre bancário</div>
        <div class="text-2xl font-extrabold">${br(state.bank.vault)}</div>
      </div>
      <div class="card p-4 col-span-2">
        <div class="font-semibold mb-2">Fila aguardando cofre</div>
        <ul class="flex flex-col gap-2" id="vaultList">${list}</ul>
      </div>
    </div>
  `,'Cofre Bancário');
}

// RENDER
function render(){
  if(currentView==='login'){ app.innerHTML = viewLogin(); onLoginMount(); return; }
  const role = sessionStorage.getItem('if_role'); if(!role){ currentView='login'; render(); return; }
  if(currentView==='dashboard'){ app.innerHTML = viewDashboard(); attachShell(); }
  if(currentView==='clientes'){ app.innerHTML = viewClientes(); attachShell(); attachClientes(); }
  if(currentView==='transacoes'){ app.innerHTML = viewTransacoes(); attachShell(); attachTransacoes(); }
  if(currentView==='cofre'){ app.innerHTML = viewCofre(); attachShell(); attachCofre(); }
}
function attachShell(){
  document.querySelectorAll('[data-goto]').forEach(b=> b.onclick = ()=> goto(b.dataset.goto));
  document.getElementById('logout').onclick = ()=>{ sessionStorage.clear(); currentView='login'; render(); };
  document.getElementById('backBtn').onclick = back;
}
function attachClientes(){
  document.getElementById('btnNovo').onclick = ()=>{
    const name = prompt('Nome completo:'); if(!name) return;
    const cpf = prompt('CPF:'); const bal = Number(prompt('Saldo inicial (R$):','0')||0);
    state.clients.push({id:Date.now(), name, cpf, active:true, balance:bal});
    save(state); render();
  };
}
function attachTransacoes(){
  const pen = document.getElementById('listPen');
  pen.onclick = async (e)=>{
    const ap = e.target.getAttribute('data-approve');
    const rj = e.target.getAttribute('data-reject');
    if(ap){
      const ok = await biometric(true);
      if(!ok) return;
      const id = Number(ap), tx = state.tx.find(t=>t.id===id);
      const from = state.clients.find(c=>c.id===tx.from);
      if(from.balance < tx.amount){ alert('Saldo insuficiente'); return; }
      from.balance -= tx.amount; tx.status='awaiting_vault';
      save(state); render();
    }
    if(rj){
      const id = Number(rj), tx = state.tx.find(t=>t.id===id); tx.status='rejected'; save(state); render();
    }
  };
}
function attachCofre(){
  document.getElementById('vaultList').onclick = async (e)=>{
    const rl = e.target.getAttribute('data-release');
    const cl = e.target.getAttribute('data-cancel');
    if(rl){
      const ok = await biometric(false);
      if(!ok) return;
      const id = Number(rl), tx = state.tx.find(t=>t.id===id);
      const to = state.clients.find(c=>c.id===tx.to);
      if(state.bank.vault < tx.amount){ alert('Cofre insuficiente'); return; }
      state.bank.vault -= tx.amount; to.balance += tx.amount; tx.status='approved';
      save(state); render();
    }
    if(cl){
      const id = Number(cl), tx = state.tx.find(t=>t.id===id);
      const from = state.clients.find(c=>c.id===tx.from); from.balance += tx.amount; tx.status='rejected';
      save(state); render();
    }
  };
}

// Biometria com face-api — auto câmera + bounding box + timeout
async function ensureModels(){
  if(window._if_models_loaded) return true;
  const base='https://justadudewhohacks.github.io/face-api.js/models';
  try{ await faceapi.nets.tinyFaceDetector.loadFromUri(base); window._if_models_loaded=true; return true; }
  catch{ alert('Não foi possível carregar os modelos de face.'); return false; }
}
async function biometric(isAdminStep){
  if(!(await ensureModels())) return false;
  const modal = document.createElement('div');
  modal.className='fixed inset-0 bg-black/60 flex items-center justify-center z-50';
  modal.innerHTML = `<div class="card w-[360px] p-3 text-center">
    <div class="font-semibold mb-2">${isAdminStep?'Biometria (Admin)':'Biometria (Tesoureiro)'}</div>
    <div class="relative"><video id="v" autoplay playsinline muted class="cam"></video><canvas id="c" class="overlay"></canvas></div>
    <div id="s" class="text-xs text-muted mt-2">Abrindo câmera...</div>
    <div class="flex gap-2 justify-center mt-3">
      <button id="ok" class="btn btn-primary !py-1" disabled>Confirmar</button>
      <button id="no" class="btn !py-1">Cancelar</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  const v=modal.querySelector('#v'), c=modal.querySelector('#c'), s=modal.querySelector('#s'), ok=modal.querySelector('#ok'), no=modal.querySelector('#no');
  let stream;
  try{
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});
    v.srcObject = stream; await new Promise(r=> v.onloadedmetadata=r);
    s.textContent='Buscando rosto...'; c.width=v.clientWidth||360; c.height=220;
  }catch{ s.textContent='Sem acesso à câmera.'; return false; }
  const ctx=c.getContext('2d'); const opts=new faceapi.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:0.5});
  let stop=false; const start=Date.now(); const TIMEOUT=25000;
  async function loop(){
    if(stop) return;
    try{
      const det = await faceapi.detectSingleFace(v, opts);
      ctx.clearRect(0,0,c.width,c.height);
      if(det){
        const box=det.box, sx=c.width/(v.videoWidth||c.width), sy=c.height/(v.videoHeight||c.height);
        ctx.strokeStyle='#00d1ff'; ctx.lineWidth=3; ctx.strokeRect(box.x*sx, box.y*sy, box.width*sx, box.height*sy);
        s.textContent='Rosto detectado. Confirme para prosseguir.'; ok.disabled=false;
      } else { s.textContent='Buscando rosto...'; ok.disabled=true; }
    }catch{ s.textContent='Erro na detecção.'; }
    if(Date.now()-start>TIMEOUT){ cleanup(false,true); return; }
    requestAnimationFrame(loop);
  }
  loop();
  return await new Promise(res=>{
    ok.onclick = ()=> cleanup(true,false);
    no.onclick = ()=> cleanup(false,false);
    function cleanup(val,timeout){
      stop=true; if(stream) stream.getTracks().forEach(t=>t.stop());
      modal.remove(); if(timeout) alert('Tempo esgotado sem detectar rosto.'); res(val);
    }
  });
}

render();
