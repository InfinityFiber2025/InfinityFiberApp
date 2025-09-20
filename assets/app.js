
const STORE_KEY='if_admin_state_v5';
const initialState = {
  bank: { vault: 37300000000.00 },
  clients: [
    {id:1,name:'Gustavo Caldas Braga',cpf:'111.111.111-11',active:true,balance:200000},
    {id:2,name:'Maria Thereza Caldas Braga',cpf:'222.222.222-22',active:true,balance:200000},
    {id:3,name:'Daniel Braga Kascher',cpf:'333.333.333-33',active:true,balance:200000},
  ],
  tx:[
    {id:101,from:1,to:2,amount:200000,status:'pending',desc:'Pix pendente 1'},
    {id:102,from:2,to:3,amount:200000,status:'pending',desc:'Pix pendente 2'},
    {id:103,from:3,to:1,amount:200000,status:'pending',desc:'Pix pendente 3'},
  ]
};
function loadState(){ const s=localStorage.getItem(STORE_KEY); if(s){ try{return JSON.parse(s);}catch(e){} } localStorage.setItem(STORE_KEY, JSON.stringify(initialState)); return JSON.parse(JSON.stringify(initialState)); }
function saveState(st){ localStorage.setItem(STORE_KEY, JSON.stringify(st)); }
function br(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function guard(){ const role=sessionStorage.getItem('if_role'); if(!role) location.href='index.html'; return role; }
const role = guard();
const state = loadState();
document.querySelectorAll('.role-admin').forEach(el=>{ el.style.display = (role==='admin'?'':'none'); });
document.querySelectorAll('.role-treasurer').forEach(el=>{ el.style.display = (role==='treasurer'?'':'none'); });
document.getElementById('roleBadge').textContent = role==='admin' ? 'Perfil: Administrador' : 'Perfil: Tesoureiro';

const views = { home:byId('view-home'), clients:byId('view-clients'), tx:byId('view-tx'), vault:byId('view-vault') };
byId('menu').addEventListener('click', e=>{ const a=e.target.closest('a'); if(!a) return; e.preventDefault(); const tab=a.dataset.tab;
  document.querySelectorAll('#menu a').forEach(x=>x.classList.remove('active')); a.classList.add('active');
  Object.values(views).forEach(v=>v.classList.add('hidden')); views[tab].classList.remove('hidden');
  if(tab==='home') renderHome(); if(tab==='clients') renderClients(); if(tab==='tx') renderTx(); if(tab==='vault') renderVault();
});
function byId(id){ return document.getElementById(id); }

function renderHome(){
  byId('statClients').textContent = state.clients.length;
  const total = state.clients.reduce((s,c)=>s + Number(c.balance||0), 0);
  byId('statTotal').textContent = br(total);
  byId('statPending').textContent = state.tx.filter(t=>t.status==='pending').length;
  const ctx = byId('chartBalances');
  if(ctx._chart) { ctx._chart.destroy(); }
  const labels = state.clients.map(c=>c.name.split(' ')[0]);
  const data = state.clients.map(c=>c.balance);
  ctx._chart = new Chart(ctx, { type:'bar', data:{labels, datasets:[{label:'Saldo', data}]},
    options:{responsive:true, plugins:{legend:{display:false}}, scales:{y:{ticks:{color:'#ccc'}, grid:{color:'#222'}}, x:{ticks:{color:'#ccc'}, grid:{display:false}}}} });
}
renderHome();

function renderClients(){
  const tb = byId('clientsTbody'); tb.innerHTML='';
  state.clients.forEach(c=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${c.name}</td><td>${c.cpf}</td><td>${br(c.balance)}</td><td>${c.active?'Ativo':'Inativo'}</td>`; tb.appendChild(tr); });
}
byId('btnNewClient')?.addEventListener('click', ()=> byId('modalClient').classList.remove('hidden'));
byId('ncCancel')?.addEventListener('click', ()=> byId('modalClient').classList.add('hidden'));
byId('ncSave')?.addEventListener('click', ()=>{
  const name=byId('ncName').value.trim(), cpf=byId('ncCpf').value.trim(), bal=Number(byId('ncBalance').value||0);
  if(!name||!cpf){ alert('Preencha nome e CPF'); return; }
  state.clients.push({id:Date.now(), name, cpf, active:true, balance:bal});
  saveState(state); byId('modalClient').classList.add('hidden'); renderHome(); renderClients();
});

function renderTx(){
  const pendingList = byId('pendingList'); pendingList.innerHTML='';
  const awaitingList = byId('awaitingList'); awaitingList.innerHTML='';
  state.tx.filter(t=>t.status==='pending').forEach(t=>{
    const from = state.clients.find(c=>c.id===t.from)?.name||'—';
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li=document.createElement('li');
    li.innerHTML = `<div class="row-between"><div><strong>${from}</strong> → ${to}</div><div>${br(t.amount)}</div></div>
                    <div class="row"><button class="btn primary" data-approve="${t.id}">Aprovar (digital+rosto)</button>
                    <button class="btn ghost" data-reject="${t.id}">Recusar</button></div>`;
    pendingList.appendChild(li);
  });
  state.tx.filter(t=>t.status==='awaiting_vault').forEach(t=>{
    const from = state.clients.find(c=>c.id===t.from)?.name||'—';
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li=document.createElement('li');
    li.innerHTML = `<div class="row-between"><div><strong>${from}</strong> → ${to}</div><div>${br(t.amount)}</div></div>
                    <div class="muted small">Aguardando liberação do cofre</div>`;
    awaitingList.appendChild(li);
  });
}
byId('pendingList')?.addEventListener('click', async e=>{
  const ap=e.target.getAttribute('data-approve'); const rj=e.target.getAttribute('data-reject');
  if(ap){
    const ok = await biometricWithCamera('bio');
    if(!ok) return;
    const id = Number(ap);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const from = state.clients.find(c=>c.id===tx.from);
    if(!from){ alert('Remetente inválido'); return; }
    if(from.balance < tx.amount){ alert('Saldo insuficiente'); return; }
    from.balance -= tx.amount;
    tx.status = 'awaiting_vault';
    saveState(state); renderHome(); renderTx(); renderClients();
  }
  if(rj){
    const id = Number(rj);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    tx.status='rejected'; saveState(state); renderHome(); renderTx();
  }
});

function renderVault(){
  byId('vaultAmount').textContent = br(state.bank.vault);
  const list = byId('vaultWaiting'); list.innerHTML='';
  state.tx.filter(t=>t.status==='awaiting_vault').forEach(t=>{
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li=document.createElement('li');
    li.innerHTML = `<div class="row-between"><div>Crédito para <strong>${to}</strong></div><div>${br(t.amount)}</div></div>
                    <div class="row"><button class="btn primary" data-release="${t.id}">Liberar (facial)</button>
                    <button class="btn ghost" data-cancel="${t.id}">Cancelar</button></div>`;
    list.appendChild(li);
  });
}
byId('vaultWaiting')?.addEventListener('click', async e=>{
  const rl=e.target.getAttribute('data-release'); const cl=e.target.getAttribute('data-cancel');
  if(rl){
    const ok = await biometricWithCamera('face');
    if(!ok) return;
    const id = Number(rl);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const to = state.clients.find(c=>c.id===tx.to);
    if(!to){ alert('Destinatário inválido'); return; }
    if(state.bank.vault < tx.amount){ alert('Cofre insuficiente'); return; }
    state.bank.vault -= tx.amount; to.balance += tx.amount; tx.status='approved';
    saveState(state); renderHome(); renderVault(); renderClients(); renderTx();
  }
  if(cl){
    const id = Number(cl);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const from = state.clients.find(c=>c.id===tx.from);
    if(from) from.balance += tx.amount;
    tx.status='rejected'; saveState(state); renderHome(); renderVault(); renderTx(); renderClients();
  }
});

byId('btnVault').addEventListener('click', ()=>{ byId('modalVaultAmount').textContent = br(state.bank.vault); byId('modalVault').classList.remove('hidden'); });
byId('vaultClose').addEventListener('click', ()=> byId('modalVault').classList.add('hidden'));

byId('btnExport').addEventListener('click', ()=>{
  const dump={bank:state.bank,clients:state.clients,tx:state.tx};
  const blob=new Blob([JSON.stringify(dump,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='infinityfiber_export.json'; a.click();
});
byId('fileImport').addEventListener('change', e=>{
  const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ try{ const d=JSON.parse(r.result); if(!d.bank||!d.clients||!d.tx) throw 0;
    state.bank=d.bank; state.clients=d.clients; state.tx=d.tx; saveState(state);
    renderHome(); renderClients(); renderTx(); renderVault(); alert('Importado com sucesso'); }catch{ alert('JSON inválido'); } };
  r.readAsText(f);
});
byId('btnLogout').addEventListener('click', ()=>{ sessionStorage.removeItem('if_role'); location.href='index.html'; });
if(role==='admin'){ document.querySelector('[data-tab=\"home\"]').click(); } else { document.querySelector('[data-tab=\"vault\"]').click(); }

// ---- Webcam + face-api.js + bounding box + timeout ----
async function ensureModels(){
  if(window._if_models_loaded) return true;
  const base = 'https://justadudewhohacks.github.io/face-api.js/models';
  try{ await faceapi.nets.tinyFaceDetector.loadFromUri(base); window._if_models_loaded=true; return true; }
  catch(e){ alert('Falha ao carregar modelos de detecção facial.'); return false; }
}
async function startCamera(videoEl){
  const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user' }, audio:false });
  videoEl.srcObject = stream;
  await new Promise(res=> videoEl.onloadedmetadata = res);
  return stream;
}
function drawBox(canvas, det){
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!det) return;
  const {x,y,width,height} = det.box;
  const scaleX = canvas.width / canvas.videoWidth || 1;
  const scaleY = canvas.height / canvas.videoHeight || 1;
  ctx.strokeStyle = '#00d1ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(x*scaleX, y*scaleY, width*scaleX, height*scaleY);
}
async function biometricWithCamera(kind){
  const isAdmin = (kind==='bio');
  if(!(await ensureModels())) return false;
  const modal = byId(isAdmin? 'modalBio':'modalFace');
  const video = byId(isAdmin? 'bioVideo':'faceVideo');
  const canvas = byId(isAdmin? 'bioCanvas':'faceCanvas');
  const status = byId(isAdmin? 'bioStatus':'faceStatus');
  const okBtn = byId(isAdmin? 'bioOk':'faceOk');
  const noBtn = byId(isAdmin? 'bioNo':'faceNo');
  okBtn.disabled = true;
  modal.classList.remove('hidden');
  let stream;
  try{ stream = await startCamera(video); status.textContent='Câmera ativa. Buscando rosto...'; }
  catch(e){ status.textContent='Não foi possível acessar a câmera.'; return false; }
  // ensure canvas matches video box
  const W = video.clientWidth || 360, H = 220; canvas.width=W; canvas.height=H;
  let stop=false; const start=Date.now(); const TIMEOUT=25000;
  const opts=new faceapi.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:0.5});
  async function loop(){ if(stop) return;
    try{
      const det = await faceapi.detectSingleFace(video, opts);
      drawBox(canvas, det);
      if(det){ status.textContent='Rosto detectado ✅'; okBtn.disabled=false; }
      else { status.textContent='Buscando rosto...'; okBtn.disabled=true; }
    }catch(e){ status.textContent='Erro na detecção.'; }
    if(Date.now()-start > TIMEOUT){ cleanup(false, true); return; }
    requestAnimationFrame(loop);
  } loop();
  return new Promise(resolve=>{
    okBtn.onclick = ()=> cleanup(true, false);
    noBtn.onclick = ()=> cleanup(false, false);
    function cleanup(val, timedOut){
      stop=true; if(stream){ stream.getTracks().forEach(t=>t.stop()); }
      modal.classList.add('hidden'); okBtn.onclick=null; noBtn.onclick=null;
      if(timedOut) alert('Tempo esgotado sem detectar rosto. Operação cancelada.');
      resolve(val);
    }
  });
}
