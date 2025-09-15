// ====== Estado & Util ======
const LS='if_bank_pro_v1';
const BANKS=['Infinity Banco Digital','Banco do Brasil','Caixa','Itaú Unibanco','Bradesco','Santander','Nubank','BTG Pactual','C6 Bank','Inter','Mercado Pago'];
const fmtBRL=n=>(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const now=()=>new Date().toISOString();
function defState(){return{
  auth:{login:'DanielKascher',senha:'K@scher123'},
  user:{nome:'Daniel Kascher'},
  conta:{agencia:'0001',numero:'453-5'},
  saldo:50000000,
  extrato:[{dt:now(),tipo:'Crédito',desc:'Saldo inicial',valor:50000000,icon:'💰'}],
  contatos:[
    {id:1,nome:'Rogério Ramos',banco:'Infinity Banco Digital',agencia:'0001',conta:'453-5',pix:'rogerio@email.com',fav:true},
    {id:2,nome:'Alex Marques',banco:'Bradesco',agencia:'1222',conta:'009876-1',pix:'',fav:false},
    {id:3,nome:'Anderson Correa',banco:'Itaú Unibanco',agencia:'3456',conta:'12345-8',pix:'',fav:false},
    {id:4,nome:'Andreia Costa',banco:'Nubank',agencia:'0001',conta:'111111-1',pix:'andreia@nubank.com',fav:false},
    {id:5,nome:'Gilberto Conceição',banco:'Infinity Banco Digital',agencia:'0001',conta:'222222-2',pix:'',fav:true},
    {id:6,nome:'Marcelo Souza',banco:'Itaú Unibanco',agencia:'1234',conta:'56789-0',pix:'',fav:false},
  ],
  cartao:null
};}
function load(){try{return JSON.parse(localStorage.getItem(LS))||defState();}catch(e){return defState();}}
function save(){localStorage.setItem(LS,JSON.stringify(S));}
let S=load();

function pushMov(tipo,desc,valor,icon){S.extrato.unshift({dt:now(),tipo,desc,valor,icon:icon||'🔄'});S.saldo=(S.saldo||0)+(valor||0);save();}

// ====== Auth ======
function loginDo(){const u=byId('u').value,p=byId('p').value;if(u===S.auth.login&&p===S.auth.senha){location='home.html';}else alert('Usuário ou senha inválidos.');}

// ====== Home ======
function homeLoad(){byId('saldoHome').textContent=fmtBRL(S.saldo);byId('titular').textContent=S.user.nome;byId('cc').textContent=`Ag ${S.conta.agencia} • Cc ${S.conta.numero}`;}

// ====== Extrato ======
function saldoLoad(){
  byId('saldoAtual').textContent=fmtBRL(S.saldo);
  renderExtrato('all');
  ['7','30','all'].forEach(k=>byId('flt'+k).onclick=()=>renderExtrato(k));
}
function renderExtrato(range){
  const tbody=byId('tbody');tbody.innerHTML='';
  const nowD=new Date();
  S.extrato.filter(m=>{
    if(range==='all')return true;
    const d=new Date(m.dt);
    const diff=(nowD-d)/(1000*60*60*24);
    return diff<=parseInt(range);
  }).forEach(m=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${new Date(m.dt).toLocaleString('pt-BR')}</td>
      <td>${m.icon||'🔄'} ${m.tipo}</td>
      <td>${m.desc}</td>
      <td style="text-align:right" class="mono">${fmtBRL(m.valor)}</td>`;
    tbody.appendChild(tr);
  });
}

// ====== Contatos ======
function contatosLoad(){
  fillBankSelect('c_banco');
  renderContatos();
  byId('c_fav').addEventListener('change',e=>{});
}
function renderContatos(filter=''){
  const list=byId('listContatos');list.innerHTML='';
  const term=filter.toLowerCase();
  // ordenar: favoritos primeiro
  S.contatos.slice().sort((a,b)=>(b.fav?1:0)-(a.fav?1:0)||a.nome.localeCompare(b.nome)).forEach(c=>{
    if(term && !c.nome.toLowerCase().includes(term)) return;
    const li=document.createElement('div');li.className='contact';
    const initials=c.nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    li.innerHTML=`<div class="avatar">${initials}</div>
      <div class="name">${c.nome}<div class="small">${c.pix?('PIX: '+c.pix):(`${c.agencia}/${c.conta}`)}</div></div>
      <div class="bank">${c.banco}</div>
      <button class="iconbtn" title="Favoritar" onclick="toggleFav(${c.id})">${c.fav?'⭐':'☆'}</button>
      <button class="btn pix-btn" onclick="irTransferir('${c.nome.replace(/'/g,"\\'")}')">Fazer Pix/TED</button>`;
    list.appendChild(li);
  });
}
function toggleFav(id){const c=S.contatos.find(x=>x.id===id);if(!c)return;c.fav=!c.fav;save();renderContatos(byId('buscaContato').value||'');}
function addContatoForm(){
  const nome=byId('c_nome').value.trim();
  const banco=byId('c_banco').value;
  const agencia=byId('c_ag').value.trim();
  const conta=byId('c_cc').value.trim();
  const pix=byId('c_pix').value.trim();
  if(!nome||!banco) return alert('Preencha ao menos Nome e Banco.');
  let ag=agencia, cc=conta;
  if(banco==='Infinity Banco Digital'){ag='0001';cc='453-5';}
  const id=(S.contatos.reduce((m,x)=>Math.max(m,x.id),0)+1)||1;
  S.contatos.push({id,nome,banco,agencia:ag,conta:cc,pix,fav:false}); save();
  alert('Contato salvo!'); clearContatoForm(); renderContatos();
}
function clearContatoForm(){['c_nome','c_ag','c_cc','c_pix'].forEach(id=>byId(id).value='');byId('c_banco').selectedIndex=0;}
function irTransferir(nome){location='transferencia.html?to='+encodeURIComponent(nome);}

// ====== Transferência ======
function transfLoad(){
  // Tabs: Contatos / Fazer Pix ou TED / Limites
  const q=new URLSearchParams(location.search);const pre=q.get('to');byId('search').value=pre||'';
  fillBankSelect('t_banco');
  if(pre) filterContacts();
  renderTransfContacts();
}
function renderTransfContacts(){
  const list=byId('t_list');list.innerHTML='';
  const term=(byId('search').value||'').toLowerCase();
  S.contatos.slice().sort((a,b)=>(b.fav?1:0)-(a.fav?1:0)||a.nome.localeCompare(b.nome)).forEach(c=>{
    if(term && !c.nome.toLowerCase().includes(term)) return;
    const initials=c.nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    const li=document.createElement('div');li.className='contact';
    li.innerHTML=`<div class="avatar">${initials}</div>
      <div class="name">${c.nome}<div class="small">${c.pix?('PIX: '+c.pix):(`${c.agencia}/${c.conta}`)}</div></div>
      <div class="bank">${c.banco}</div>
      <button class="btn pix-btn" onclick="abrirConf('${c.nome.replace(/'/g,"\\'")}')">Fazer Pix/TED</button>`;
    list.appendChild(li);
  });
}
function filterContacts(){renderTransfContacts();}
function abrirConf(nome){
  const c=S.contatos.find(x=>x.nome===nome); if(!c) return alert('Contato não encontrado.');
  byId('confirmBox').classList.remove('hidden');
  byId('conf_nome').textContent=nome;
  byId('t_banco').value=c.banco;
  byId('t_ag').value=c.agencia;
  byId('t_cc').value=c.conta;
}
function tEnviar(){
  const tipo=byId('t_tipo').value; // PIX ou TED
  const valor=parseFloat(byId('t_valor').value||'0');
  if(isNaN(valor)||valor<=0) return alert('Informe um valor válido.');
  if(S.saldo<valor) return alert('Saldo insuficiente.');
  let desc='';
  if(tipo==='PIX'){
    const chave=byId('t_pix').value.trim()||byId('conf_nome').textContent;
    desc=`PIX para ${chave}`;
  }else{
    const b=byId('t_banco').value, ag=byId('t_ag').value.trim(), cc=byId('t_cc').value.trim();
    desc=`TED p/ ${byId('conf_nome').textContent} • ${b} Ag ${ag} Cc ${cc}`;
  }
  pushMov('Débito', desc, -valor, '🔄');
  alert('Transferência enviada: '+fmtBRL(valor)); location='saldo.html';
}

// ====== Cartões Virtuais ======
function randDigits(n){return Array.from({length:n},()=>Math.floor(Math.random()*10)).join('');}
function chunkPan(p){return p.replace(/(\d{4})(?=\d)/g,'$1 ').trim();}
function cardsLoad(){renderCard('vc_wrap',false);}
function genCard(tipo,modo){
  const pan=randDigits(16), cvv=randDigits(3);
  const mm=String(1+Math.floor(Math.random()*12)).padStart(2,'0');
  const yy=String(new Date().getFullYear()+3).slice(-2);
  S.cartao={tipo,modo,pan,cvv,exp:`${mm}/${yy}`}; save(); renderCard('vc_wrap',false);
  alert('Cartão '+tipo+' ('+modo+') gerado!');
}
function renderCard(containerId,show=false){
  const el=byId(containerId); if(!el) return;
  if(!S.cartao){ el.innerHTML='<div class="small">Nenhum cartão virtual gerado ainda.</div>'; return; }
  const klass=S.cartao.tipo==='Lite'?'card-lite':(S.cartao.tipo==='Black'?'card-black':'card-unlimited');
  const cvv=show?S.cartao.cvv:'***';
  el.innerHTML=`<div class="vcard ${klass}">
    <div class="row2"><div class="brand">∞ Infinity Fiber</div><div class="meta">${S.cartao.modo||'Crédito'}</div></div>
    <div class="pan mono">${chunkPan(S.cartao.pan)}</div>
    <div class="row2"><div class="meta">Val: ${S.cartao.exp} • CVV: <span id="cvv">${cvv}</span></div>
      <button class="copybtn" onclick="navigator.clipboard.writeText('${S.cartao.pan}')">Copiar número</button></div>
    <div class="row2"><div class="name">${S.user.nome||'Cliente Infinity'}</div>
      <button class="copybtn" onclick="toggleCVV()">Mostrar/ocultar CVV</button></div>
  </div>`;
}
function toggleCVV(){const el=byId('cvv'); if(!el||!S.cartao)return; el.textContent=(el.textContent==='***')?S.cartao.cvv:'***';}

// ====== Helpers ======
function fillBankSelect(id){
  const sel=byId(id); if(!sel) return; sel.innerHTML='';
  BANKS.forEach(b=>{const o=document.createElement('option');o.textContent=b;sel.appendChild(o);});
  if(sel.id.startsWith('t_')) sel.onchange=()=>{ if(sel.value==='Infinity Banco Digital'){byId('t_ag').value='0001';byId('t_cc').value='453-5';}};
}
function byId(id){return document.getElementById(id);}
