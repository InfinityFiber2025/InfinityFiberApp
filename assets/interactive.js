
// Interactive simulation for Infinity Fiber - client and admin share same logic
const DATA_KEY = 'infinityfiber_sim_data_v1';

async function loadInitialData(){
  // load base JSONs
  const clientsRes = await fetch('data/clientes.json'); const baseClients = await clientsRes.json();
  const txRes = await fetch('data/transacoes.json'); const baseTx = await txRes.json();
  // combine into a single state saved in localStorage for interactivity
  const saved = localStorage.getItem(DATA_KEY);
  if(saved){
    try { return JSON.parse(saved); } catch(e){ localStorage.removeItem(DATA_KEY); }
  }
  const state = { clients: baseClients, transactions: baseTx, bank: { vault: 37200000000.00 } };
  localStorage.setItem(DATA_KEY, JSON.stringify(state));
  return state;
}

function saveState(state){ localStorage.setItem(DATA_KEY, JSON.stringify(state)); }

function formatBR(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

// Client page functions
async function clientInit(){
  const state = await loadInitialData();
  const client = state.clients.find(c=>c.user==='DanielKascher') || state.clients[0];
  document.getElementById('clientName').textContent = client.name;
  document.getElementById('clientBalance').textContent = formatBR(client.balance);
  renderClientTxs(state, client.id);
  // create tx
  document.getElementById('sendTx').addEventListener('click', ()=>{
    const destUser = document.getElementById('destUser').value.trim();
    const amount = Number(document.getElementById('txAmount').value) || 0;
    if(!destUser || amount<=0){ alert('Preencha destinatário e valor válidos'); return; }
    const dest = state.clients.find(c=>c.user===destUser);
    if(!dest){ alert('Destinatário não encontrado (use user: gustavo ou maria)'); return; }
    // create pending tx: from current client to dest
    const nextId = Date.now();
    const tx = { id: nextId, from: client.id, fromName: client.name, to: dest.id, toName: dest.name, amount: amount, status: 'pending', type:'pix', desc: 'Pix (simulado)' };
    state.transactions.push(tx);
    saveState(state);
    alert('Transação criada e marcada como PENDING. Admin poderá aprovar.');
    renderClientTxs(state, client.id);
  });
}

// render client's transactions
function renderClientTxs(state, clientId){
  const list = document.getElementById('txList');
  list.innerHTML='';
  const related = state.transactions.filter(t=>t.from===clientId||t.to===clientId).slice(-20).reverse();
  related.forEach(t=>{ const li = document.createElement('li'); li.textContent = `${t.desc} — ${formatBR(t.amount)} — ${t.status}`; list.appendChild(li); });
}

// Admin page functions
async function adminInit(){
  const state = await loadInitialData();
  renderAdmin(state);
  // attach approve/reject handlers via delegation
  document.getElementById('pendingList').addEventListener('click', function(ev){
    const btn = ev.target.closest('button'); if(!btn) return;
    const id = Number(btn.dataset.id);
    const approve = !btn.dataset.deny;
    handleTxDecision(id, approve);
  });
}

function renderAdmin(state){
  document.getElementById('clientsCount').textContent = state.clients.length;
  document.getElementById('bankVault').textContent = formatBR(state.bank.vault);
  const ul = document.getElementById('pendingList'); ul.innerHTML='';
  state.transactions.filter(t=>t.status==='pending').forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${t.desc}</strong> — ${formatBR(t.amount)}</div>
                    <div>De: ${t.fromName} → Para: ${t.toName}</div>
                    <div class="row"><button class="btn" data-id="${t.id}">Aprovar</button> <button class="btn ghost" data-deny data-id="${t.id}">Rejeitar</button></div>`;
    ul.appendChild(li);
  });
  // clients table
  const tbody = document.querySelector('#clientsTable tbody'); tbody.innerHTML='';
  state.clients.forEach(c=>{ const tr = document.createElement('tr'); tr.innerHTML = `<td>${c.name}</td><td>${formatBR(c.balance)}</td><td>${c.pix||''}</td>`; tbody.appendChild(tr); });
}

function handleTxDecision(id, approve){
  const state = JSON.parse(localStorage.getItem(DATA_KEY));
  const tx = state.transactions.find(t=>t.id===id); if(!tx){ alert('Transação não encontrada'); return; }
  if(approve){
    // move money: deduct from sender, add to recipient, update bank vault
    const from = state.clients.find(c=>c.id===tx.from);
    const to = state.clients.find(c=>c.id===tx.to);
    if(!from || !to){ alert('Erro nos participantes'); return; }
    if(from.balance < tx.amount){ alert('Saldo insuficiente no remetente (simulação)'); return; }
    from.balance = Number((from.balance - tx.amount).toFixed(2));
    to.balance = Number((to.balance + tx.amount).toFixed(2));
    state.bank.vault = Number((state.bank.vault - tx.amount).toFixed(2));
    tx.status = 'approved';
    saveState(state);
    renderAdmin(state);
    alert('Transação aprovada e saldos atualizados (simulação)');
  } else {
    tx.status = 'rejected';
    saveState(state);
    renderAdmin(state);
    alert('Transação rejeitada (simulação)');
  }
}

// init based on page
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('clientBalance')) clientInit();
  if(document.getElementById('bankVault')) adminInit();
});
