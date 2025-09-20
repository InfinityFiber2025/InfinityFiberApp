
const STORE_KEY='if_admin_state_v1';
const seed = {
  clients:[
    {id:1,name:'Gustavo Caldas Braga',cpf:'111.111.111-11',active:true,balance:200000},
    {id:2,name:'Maria Thereza Caldas Braga',cpf:'222.222.222-22',active:true,balance:200000},
    {id:3,name:'Daniel Braga Kascher',cpf:'333.333.333-33',active:true,balance:200000}
  ],
  tx:[
    {id:101,from:1,to:2,amount:200000,status:'pending',desc:'Pix pendente 1'},
    {id:102,from:2,to:3,amount:200000,status:'pending',desc:'Pix pendente 2'},
    {id:103,from:3,to:1,amount:200000,status:'pending',desc:'Pix pendente 3'}
  ]
};
function loadState(){ const s=localStorage.getItem(STORE_KEY); if(s){try{return JSON.parse(s);}catch(e){}} localStorage.setItem(STORE_KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
function saveState(st){ localStorage.setItem(STORE_KEY, JSON.stringify(st)); }
function br(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
const viewHome=document.getElementById('viewHome'), viewClients=document.getElementById('viewClients'), viewTx=document.getElementById('viewTx');
function show(tab){ document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active')); document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  if(tab==='home'){document.getElementById('navHome').classList.add('active');viewHome.classList.remove('hidden');}
  if(tab==='clients'){document.getElementById('navClients').classList.add('active');viewClients.classList.remove('hidden');}
  if(tab==='tx'){document.getElementById('navTx').classList.add('active');viewTx.classList.remove('hidden');}}
document.getElementById('navHome').addEventListener('click',e=>{e.preventDefault();show('home');render();});
document.getElementById('navClients').addEventListener('click',e=>{e.preventDefault();show('clients');renderClients();});
document.getElementById('navTx').addEventListener('click',e=>{e.preventDefault();show('tx');renderTx();});
if(sessionStorage.getItem('if_admin_ok')!=='1'){ window.location.href='index.html'; }
let state = loadState();
function render(){ document.getElementById('statClients').textContent = state.clients.length;
  const total = state.clients.reduce((s,c)=>s+Number(c.balance||0),0);
  document.getElementById('statTotal').textContent = br(total);
  document.getElementById('statPending').textContent = state.tx.filter(t=>t.status==='pending').length; }
render();
function renderClients(){ const tb=document.getElementById('clientsTbody'); tb.innerHTML=''; state.clients.forEach(c=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${c.name}</td><td>${c.cpf}</td><td>${br(c.balance)}</td><td>${c.active?'Ativo':'Inativo'}</td>`; tb.appendChild(tr); }); }
document.getElementById('btnNewClient').addEventListener('click',()=>{ document.getElementById('modalClient').classList.remove('hidden'); });
document.getElementById('ncCancel').addEventListener('click',()=>{ document.getElementById('modalClient').classList.add('hidden'); });
document.getElementById('ncSave').addEventListener('click',()=>{ const name=document.getElementById('ncName').value.trim(); const cpf=document.getElementById('ncCpf').value.trim(); const bal=Number(document.getElementById('ncBalance').value||0); if(!name||!cpf){alert('Preencha nome e CPF');return;} const id=Date.now(); state.clients.push({id,name,cpf,active:true,balance:bal}); saveState(state); document.getElementById('modalClient').classList.add('hidden'); render(); renderClients(); });
function renderTx(){ const list=document.getElementById('pendingList'); list.innerHTML=''; state.tx.filter(t=>t.status==='pending').forEach(t=>{ const from=state.clients.find(c=>c.id===t.from)?.name||'—'; const to=state.clients.find(c=>c.id===t.to)?.name||'—'; const li=document.createElement('li'); li.innerHTML=`<div class="row" style="justify-content:space-between;"><div><strong>${from}</strong> → ${to}</div><div>${br(t.amount)}</div></div><div class="row"><button class="btn primary" data-approve="${t.id}">Aprovar</button><button class="btn ghost" data-reject="${t.id}">Recusar</button></div>`; list.appendChild(li); }); }
function askBiometric(){ return new Promise(res=>{ const modal=document.getElementById('modalBio'); modal.classList.remove('hidden'); const ok=()=>{cleanup();res(true)}; const no=()=>{cleanup();res(false)}; function cleanup(){ modal.classList.add('hidden'); document.getElementById('bioOk').removeEventListener('click',ok); document.getElementById('bioNo').removeEventListener('click',no);} document.getElementById('bioOk').addEventListener('click',ok); document.getElementById('bioNo').addEventListener('click',no); }); }
document.getElementById('pendingList').addEventListener('click', async (e)=>{ const ap=e.target.getAttribute('data-approve'); const rj=e.target.getAttribute('data-reject'); if(ap){ const ok=await askBiometric(); if(!ok) return; const id=Number(ap); const tx=state.tx.find(t=>t.id===id); if(!tx) return; const from=state.clients.find(c=>c.id===tx.from); const to=state.clients.find(c=>c.id===tx.to); if(!from||!to){alert('Participantes inválidos');return;} if(from.balance<tx.amount){alert('Saldo insuficiente no remetente');return;} from.balance-=tx.amount; to.balance+=tx.amount; tx.status='approved'; saveState(state); render(); renderTx(); renderClients(); }
  if(rj){ const id=Number(rj); const tx=state.tx.find(t=>t.id===id); if(!tx) return; tx.status='rejected'; saveState(state); render(); renderTx(); }});
show('home');
