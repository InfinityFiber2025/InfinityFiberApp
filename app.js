
const demoData = {
  bank: { cofre: 37200000000.00 },
  clients: [
    { id:1, name:'Daniel Kascher', user:'DanielKascher', cpf:'111.111.111-11', balance:200000000.00 },
    { id:2, name:'João Silva', user:'joao', cpf:'222.222.222-22', balance:1500.00 },
    { id:3, name:'Maria Souza', user:'maria', cpf:'333.333.333-33', balance:500.00 }
  ],
  transactions: [
    {id:1, from:2, to:3, amount:100.00, status:'approved', desc:'Pix enviado'},
    {id:2, from:3, to:2, amount:50.00, status:'pending', desc:'Pagamento boleto'},
  ]
};

function formatBR(value){
  return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function $(sel){return document.querySelector(sel)}
function $id(id){return document.getElementById(id)}

window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', ()=>{
  $('#enterSite').addEventListener('click', ()=>{ $('#splash').classList.add('hidden'); $('#root').classList.remove('hidden'); window.location.hash = '#/app' })
  router();
});

function router(){
  const hash = location.hash.replace('#','') || '/app';
  const main = $('#main');
  main.innerHTML = '';
  if(hash.startsWith('/admin')){
    renderAdmin(main);
  } else {
    renderApp(main);
  }
}

function renderApp(container){
  const tpl = document.getElementById('client-dashboard').content.cloneNode(true);
  container.appendChild(tpl);
  const client = demoData.clients[0];
  $id('clientName').textContent = client.name;
  $id('clientBalance').textContent = formatBR(client.balance);
  const list = $id('txList');
  demoData.transactions.filter(t=>t.from===client.id||t.to===client.id).slice(-5).reverse()
    .forEach(t=>{
      const li = document.createElement('li');
      li.textContent = `${t.desc} — ${formatBR(t.amount)} — ${t.status}`;
      list.appendChild(li);
    });
  $id('btnTransfer').addEventListener('click', ()=>{ alert('Simulação de transferência (demo)') });
  $id('btnPay').addEventListener('click', ()=>{ alert('Simulação de pagamento (demo)') });
  $id('btnCard').addEventListener('click', ()=>{ alert('Cartão digital (demo)') });
  $id('btnExtract').addEventListener('click', ()=>{ alert('Extrato completo (demo)') });
}

function renderAdmin(container){
  const tpl = document.getElementById('admin-dashboard').content.cloneNode(true);
  container.appendChild(tpl);
  $id('clientsCount').textContent = demoData.clients.length;
  $id('bankBalance').textContent = formatBR(demoData.bank.cofre);
  const tbody = container.querySelector('#clientsTable tbody');
  demoData.clients.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.cpf}</td><td>${formatBR(c.balance)}</td>`;
    tbody.appendChild(tr);
  });
  const pending = container.querySelector('#pendingTx');
  demoData.transactions.filter(t=>t.status==='pending').forEach(t=>{
    const li = document.createElement('li');
    const from = demoData.clients.find(c=>c.id===t.from);
    const to = demoData.clients.find(c=>c.id===t.to);
    li.innerHTML = `<div><strong>${from?.name}</strong> → ${to?.name} — ${formatBR(t.amount)}</div>
                    <div class="row"><button class="btn" data-id="${t.id}">Aprovar</button>
                    <button class="btn ghost" data-id="${t.id}" data-deny>Recusar</button></div>`;
    pending.appendChild(li);
  });
  pending.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    if(btn.dataset.deny!==undefined) { updateTx(id,'rejected'); return; }
    showBiometric().then(ok=>{
      if(ok) updateTx(id,'approved'); else alert('Operação cancelada');
    });
  });
}

function updateTx(id,status){
  const tx = demoData.transactions.find(t=>t.id===id);
  if(!tx) return;
  tx.status = status;
  if(status==='approved'){
    const from = demoData.clients.find(c=>c.id===tx.from);
    const to = demoData.clients.find(c=>c.id===tx.to);
    if(from && to){ from.balance -= tx.amount; to.balance += tx.amount; demoData.bank.cofre -= tx.amount; }
  }
  router();
  alert('Transação atualizada: '+status);
}

function showBiometric(){
  return new Promise((resolve)=>{
    const modal = $id('biometricModal');
    modal.classList.remove('hidden');
    const onClose = (ok)=>{
      modal.classList.add('hidden');
      $id('bioApprove').removeEventListener('click',aHandler);
      $id('bioDeny').removeEventListener('click',dHandler);
      resolve(ok);
    }
    const aHandler=()=>onClose(true);
    const dHandler=()=>onClose(false);
    $id('bioApprove').addEventListener('click',aHandler);
    $id('bioDeny').addEventListener('click',dHandler);
  });
}
