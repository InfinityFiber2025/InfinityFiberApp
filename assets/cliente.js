
const demoClientId = 1; // Daniel
async function loadClient(){
  const res = await fetch('data/clientes.json');
  const clients = await res.json();
  const client = clients.find(c=>c.id===demoClientId);
  document.getElementById('clientName').textContent = client.name;
  document.getElementById('clientBalance').textContent = client.balance.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const txRes = await fetch('data/transacoes.json'); const txs = await txRes.json();
  const related = txs.filter(t=>t.from===client.id || t.to===client.id).slice(-10).reverse();
  const ul = document.getElementById('txList'); ul.innerHTML='';
  related.forEach(t=>{ const li=document.createElement('li'); li.textContent = `${t.desc} — ${t.amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — ${t.status}`; ul.appendChild(li); });
}
document.getElementById('loginBtn').addEventListener('click', ()=>{ document.querySelector('.welcome').classList.add('hidden'); document.getElementById('dashboard').classList.remove('hidden'); loadClient(); });
