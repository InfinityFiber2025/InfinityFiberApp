
async function loadData(){
  const cRes = await fetch('data/clientes.json'); const clients = await cRes.json();
  document.getElementById('clientsCount').textContent = clients.length;
  const bank = {vault:37200000000};
  document.getElementById('bankVault').textContent = bank.vault.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const txRes = await fetch('data/transacoes.json'); const txs = await txRes.json();
  const pending = txs.filter(t=>t.status==='pending');
  const ul = document.getElementById('pendingList'); ul.innerHTML='';
  pending.forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${t.desc}</strong> — ${t.amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                    <div>De: ${t.fromName} → Para: ${t.toName}</div>
                    <div class="row"><button class="btn" data-id="${t.id}">Aprovar</button> <button class="btn ghost" data-deny data-id="${t.id}">Rejeitar</button></div>`;
    ul.appendChild(li);
  });
  ul.addEventListener('click', async (ev)=>{
    const btn = ev.target.closest('button'); if(!btn) return;
    const id = Number(btn.dataset.id);
    const approve = !btn.dataset.deny;
    alert(approve? 'Transação aprovada (simulação)':'Transação rejeitada (simulação)');
  });
}
loadData();
