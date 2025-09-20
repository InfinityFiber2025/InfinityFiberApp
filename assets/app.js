
const STORE_KEY='if_admin_state_v3';
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

const views = {
  home: document.getElementById('view-home'),
  clients: document.getElementById('view-clients'),
  tx: document.getElementById('view-tx'),
  vault: document.getElementById('view-vault'),
};
document.getElementById('menu').addEventListener('click', (e)=>{
  const a = e.target.closest('a'); if(!a) return;
  e.preventDefault();
  const tab = a.dataset.tab;
  document.querySelectorAll('#menu a').forEach(x=>x.classList.remove('active'));
  a.classList.add('active');
  Object.values(views).forEach(v=>v.classList.add('hidden'));
  views[tab].classList.remove('hidden');
  if(tab==='home') renderHome();
  if(tab==='clients') renderClients();
  if(tab==='tx') renderTx();
  if(tab==='vault') renderVault();
});

function renderHome(){
  document.getElementById('statClients').textContent = state.clients.length;
  const total = state.clients.reduce((s,c)=>s + Number(c.balance||0), 0);
  document.getElementById('statTotal').textContent = br(total);
  document.getElementById('statPending').textContent = state.tx.filter(t=>t.status==='pending').length;
  const ctx = document.getElementById('chartBalances');
  if(ctx._chart) { ctx._chart.destroy(); }
  const labels = state.clients.map(c=>c.name.split(' ')[0]);
  const data = state.clients.map(c=>c.balance);
  ctx._chart = new Chart(ctx, { type:'bar', data:{labels, datasets:[{label:'Saldo', data}]}, options:{responsive:true, plugins:{legend:{display:false}}, scales:{y:{ticks:{color:'#ccc'}, grid:{color:'#222'}}, x:{ticks:{color:'#ccc'}, grid:{display:false}}}} });
}
renderHome();

function renderClients(){
  const tb = document.getElementById('clientsTbody'); tb.innerHTML='';
  state.clients.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.cpf}</td><td>${br(c.balance)}</td><td>${c.active?'Ativo':'Inativo'}</td>`;
    tb.appendChild(tr);
  });
}
document.getElementById('btnNewClient')?.addEventListener('click', ()=>{ document.getElementById('modalClient').classList.remove('hidden'); });
document.getElementById('ncCancel')?.addEventListener('click', ()=>{ document.getElementById('modalClient').classList.add('hidden'); });
document.getElementById('ncSave')?.addEventListener('click', ()=>{
  const name = document.getElementById('ncName').value.trim();
  const cpf = document.getElementById('ncCpf').value.trim();
  const bal = Number(document.getElementById('ncBalance').value||0);
  if(!name||!cpf){ alert('Preencha nome e CPF'); return; }
  state.clients.push({id:Date.now(), name, cpf, active:true, balance: bal});
  saveState(state);
  document.getElementById('modalClient').classList.add('hidden');
  renderHome(); renderClients();
});

function renderTx(){
  const pendingList = document.getElementById('pendingList'); pendingList.innerHTML='';
  const awaitingList = document.getElementById('awaitingList'); awaitingList.innerHTML='';
  state.tx.filter(t=>t.status==='pending').forEach(t=>{
    const from = state.clients.find(c=>c.id===t.from)?.name||'—';
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li = document.createElement('li');
    li.innerHTML = `<div class="row-between"><div><strong>${from}</strong> → ${to}</div><div>${br(t.amount)}</div></div>
                    <div class="row"><button class="btn primary" data-approve="${t.id}">Aprovar (digital)</button>
                    <button class="btn ghost" data-reject="${t.id}">Recusar</button></div>`;
    pendingList.appendChild(li);
  });
  state.tx.filter(t=>t.status==='awaiting_vault').forEach(t=>{
    const from = state.clients.find(c=>c.id===t.from)?.name||'—';
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li = document.createElement('li');
    li.innerHTML = `<div class="row-between"><div><strong>${from}</strong> → ${to}</div><div>${br(t.amount)}</div></div>
                    <div class="muted small">Aguardando liberação do cofre</div>`;
    awaitingList.appendChild(li);
  });
}
document.getElementById('pendingList')?.addEventListener('click', async (e)=>{
  const ap = e.target.getAttribute('data-approve');
  const rj = e.target.getAttribute('data-reject');
  if(ap){
    const ok = await biometricDigital();
    if(!ok) return;
    const id = Number(ap);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const from = state.clients.find(c=>c.id===tx.from);
    if(!from){ alert('Remetente inválido'); return; }
    if(from.balance < tx.amount){ alert('Saldo insuficiente'); return; }
    from.balance -= tx.amount;
    tx.status = 'awaiting_vault';
    saveState(state);
    renderHome(); renderTx(); renderClients();
  }
  if(rj){
    const id = Number(rj);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    tx.status = 'rejected';
    saveState(state);
    renderHome(); renderTx();
  }
});
function biometricDigital(){ return new Promise(res=>{ const m=document.getElementById('modalBio'); m.classList.remove('hidden'); const ok=()=>{cleanup();res(true)}, no=()=>{cleanup();res(false)}; function cleanup(){ m.classList.add('hidden'); o.removeEventListener('click',ok); n.removeEventListener('click',no);} const o=document.getElementById('bioOk'), n=document.getElementById('bioNo'); o.addEventListener('click',ok); n.addEventListener('click',no); }); }

function renderVault(){
  document.getElementById('vaultAmount').textContent = br(state.bank.vault);
  const list = document.getElementById('vaultWaiting'); list.innerHTML='';
  state.tx.filter(t=>t.status==='awaiting_vault').forEach(t=>{
    const to = state.clients.find(c=>c.id===t.to)?.name||'—';
    const li = document.createElement('li');
    li.innerHTML = `<div class="row-between"><div>Crédito para <strong>${to}</strong></div><div>${br(t.amount)}</div></div>
                    <div class="row"><button class="btn primary" data-release="${t.id}">Liberar (facial)</button>
                    <button class="btn ghost" data-cancel="${t.id}">Cancelar</button></div>`;
    list.appendChild(li);
  });
}
document.getElementById('vaultWaiting')?.addEventListener('click', async (e)=>{
  const rl = e.target.getAttribute('data-release');
  const cl = e.target.getAttribute('data-cancel');
  if(rl){
    const ok = await biometricFacial();
    if(!ok) return;
    const id = Number(rl);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const to = state.clients.find(c=>c.id===tx.to);
    if(!to){ alert('Destinatário inválido'); return; }
    if(state.bank.vault < tx.amount){ alert('Cofre insuficiente'); return; }
    state.bank.vault -= tx.amount;
    to.balance += tx.amount;
    tx.status = 'approved';
    saveState(state);
    renderHome(); renderVault(); renderClients(); renderTx();
  }
  if(cl){
    const id = Number(cl);
    const tx = state.tx.find(x=>x.id===id); if(!tx) return;
    const from = state.clients.find(c=>c.id===tx.from);
    if(from) from.balance += tx.amount;
    tx.status = 'rejected';
    saveState(state);
    renderHome(); renderVault(); renderTx(); renderClients();
  }
});
function biometricFacial(){ return new Promise(res=>{ const m=document.getElementById('modalFace'); m.classList.remove('hidden'); const ok=()=>{cleanup();res(true)}, no=()=>{cleanup();res(false)}; function cleanup(){ m.classList.add('hidden'); o.removeEventListener('click',ok); n.removeEventListener('click',no);} const o=document.getElementById('faceOk'), n=document.getElementById('faceNo'); o.addEventListener('click',ok); n.addEventListener('click',no); }); }

document.getElementById('btnVault').addEventListener('click', ()=>{ document.getElementById('modalVaultAmount').textContent = br(state.bank.vault); document.getElementById('modalVault').classList.remove('hidden'); });
document.getElementById('vaultClose').addEventListener('click', ()=>{ document.getElementById('modalVault').classList.add('hidden'); });

document.getElementById('btnExport').addEventListener('click', ()=>{
  const dump = { bank: state.bank, clients: state.clients, tx: state.tx };
  const blob = new Blob([JSON.stringify(dump,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'infinityfiber_export.json';
  a.click();
});
document.getElementById('fileImport').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(!data || !data.clients || !data.tx || !data.bank) throw new Error('JSON inválido');
      state.bank = data.bank; state.clients = data.clients; state.tx = data.tx;
      saveState(state);
      renderHome(); renderClients(); renderTx(); renderVault();
      alert('Dados importados com sucesso');
    }catch(err){ alert('Falha ao importar JSON'); }
  };
  reader.readAsText(file);
});
document.getElementById('btnLogout').addEventListener('click', ()=>{ sessionStorage.removeItem('if_role'); location.href='index.html'; });
if(role==='admin'){ document.querySelector('[data-tab="home"]').click(); }else{ document.querySelector('[data-tab="vault"]').click(); }
