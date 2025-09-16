function go(u){window.location.href=u}
function logout(){go('index.html')}
const Session={titular:'Cliente Infinity',agencia:'0001',conta:'123456-7',saldo:12500.43}
function mountHeader(){const h=document.querySelector('[data-header]');if(!h)return;
  h.querySelector('[data-brand]').textContent='Banco Digital Infinity Fiber';
  h.querySelector('[data-acct]').textContent=`Ag. ${Session.agencia} • Cc ${Session.conta}`;
  h.querySelector('[data-saldo]').textContent=`Saldo: R$ ${Session.saldo.toLocaleString('pt-BR',{minimumFractionDigits:2})}`;}
document.addEventListener('DOMContentLoaded',mountHeader);

function gerarCartao(){
  const cores=[
    {nome:'Azul',bg:'linear-gradient(135deg,#0a5bd8,#083a93)'},
    {nome:'Roxo',bg:'linear-gradient(135deg,#7b2cbf,#4b0082)'},
    {nome:'Preto',bg:'linear-gradient(135deg,#1c1c1c,#000)'}
  ];
  const c=cores[Math.floor(Math.random()*cores.length)];
  const num=''+Math.floor(1000+Math.random()*9000)+' '+Math.floor(1000+Math.random()*9000)+' '+Math.floor(1000+Math.random()*9000)+' '+Math.floor(1000+Math.random()*9000);
  const val=''+String(Math.floor(Math.random()*12+1)).padStart(2,'0')+'/'+String(new Date().getFullYear()+5).slice(2);
  const cvv=''+Math.floor(100+Math.random()*900);
  const div=document.getElementById('cartao');
  div.style.background=c.bg;
  div.innerHTML=`<div class='row'><div>Infinity Fiber</div><div>${c.nome}</div></div>
    <div class='number'>${num}</div>
    <div class='row'><div><div class='label'>Validade</div><div class='value'>${val}</div></div>
    <div><div class='label'>CVV</div><div class='value'>${cvv}</div></div></div>
    <div style='margin-top:14px;font-size:14px'>${Session.titular}</div>`;
}