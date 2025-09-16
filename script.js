function go(u){window.location.href=u}
function back(){history.back()}
function logout(){go('index.html')}

const Session={titular:'Cliente Infinity',agencia:'0001',conta:'123456-7',saldo:12500.43}

function mountHeader(){
  const h=document.querySelector('[data-header]'); if(!h) return;
  const b=h.querySelector('[data-brand]'); if(b) b.textContent='Banco Digital Infinity Fiber';
  const a=h.querySelector('[data-acct]'); if(a) a.textContent=`Ag. ${Session.agencia} • Cc ${Session.conta}`;
  const s=h.querySelector('[data-saldo]'); if(s) s.textContent=`Saldo: R$ ${Session.saldo.toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
}
document.addEventListener('DOMContentLoaded', mountHeader);

// ----- Cartões (dinâmico) -----
function gerarCartao(){
  const cores=[
    {nome:'Azul',bg:'linear-gradient(135deg,#0a5bd8,#083a93)'},
    {nome:'Roxo',bg:'linear-gradient(135deg,#7b2cbf,#4b0082)'},
    {nome:'Preto',bg:'linear-gradient(135deg,#1c1c1c,#000)'}
  ];
  const c=cores[Math.floor(Math.random()*cores.length)];
  const num=[...Array(4)].map(()=>Math.floor(1000+Math.random()*9000)).join(' ');
  const val=('0'+(Math.floor(Math.random()*12)+1)).slice(-2)+'/'+String(new Date().getFullYear()+5).slice(2);
  const cvv=''+Math.floor(100+Math.random()*900);
  const div=document.getElementById('cartao'); if(!div) return;
  div.style.background=c.bg;
  div.innerHTML=`<div class='row'><div>Infinity Fiber</div><div>${c.nome}</div></div>
  <div class='number'>${num}</div>
  <div class='row'><div><div class='label'>Validade</div><div class='value'>${val}</div></div>
  <div><div class='label'>CVV</div><div class='value'>${cvv}</div></div></div>
  <div style='margin-top:14px;font-size:14px'>${Session.titular}</div>`;
}

// ----- Investimentos (dinâmico via JSON) -----
async function carregarInvestimentos(){
  try{
    const resp=await fetch('investimentos.json',{cache:'no-store'});
    const data=await resp.json();
    const tbody=document.querySelector('#lista-invest'); if(!tbody) return;
    tbody.innerHTML='';
    data.forEach(item=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${item.empresa}</td><td>${item.tipo}</td><td>${item.rentabilidade}%</td><td>${item.risco}</td>
      <td><input type='number' min='100' placeholder='Valor R$' id='val-${item.id}'></td>
      <td><button class='btn' style='padding:6px 10px;font-size:13px' onclick='simular(${JSON.stringify(item)})'>Investir</button></td>`;
      tbody.appendChild(tr);
    });
  }catch(e){
    console.error(e);
  }
}
function simular(item){
  const val=document.getElementById('val-'+item.id).value;
  if(!val||val<100){alert('Digite um valor acima de R$100');return}
  const retorno=(val*item.rentabilidade/100).toFixed(2);
  alert(`Simulação: Investindo R$${val} em ${item.empresa}, retorno estimado em 1 ano: R$${retorno}`);
}

// ----- Pagamentos (Boletos / PIX / QR) -----
let PagamentosHist=[];

async function carregarHistorico(){
  try{
    const resp=await fetch('pagamentos.json',{cache:'no-store'});
    const data=await resp.json();
    PagamentosHist=data;
    renderHistorico();
  }catch(e){
    PagamentosHist=[];
    renderHistorico();
  }
}
function renderHistorico(){
  const el=document.getElementById('hist-body'); if(!el) return;
  el.innerHTML = (PagamentosHist.length? PagamentosHist.map(p=>`
    <tr><td>${p.data}</td><td>${p.tipo}</td><td>${p.descricao}</td><td>R$ ${Number(p.valor).toLocaleString('pt-BR',{minimumFractionDigits:2})}</td></tr>
  `).join('') : `<tr><td colspan="4" class="small">Sem pagamentos ainda</td></tr>`);
}

function pagarBoleto(){
  const code=document.getElementById('boleto-codigo').value.trim();
  let valor=parseFloat(document.getElementById('boleto-valor').value);
  if(code.length<30){alert('Código de barras inválido.');return}
  if(!valor||valor<=0){ valor = Math.floor(100+Math.random()*900); } // simula leitura do valor
  if(valor>Session.saldo){alert('Saldo insuficiente.');return}
  Session.saldo-=valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'Boleto', descricao:`Boleto ${code.slice(0,5)}...`, valor});
  renderHistorico();
  alert('Boleto pago (simulação).');
}

function enviarPIX(){
  const chave=document.getElementById('pix-chave').value.trim();
  const valor=parseFloat(document.getElementById('pix-valor').value);
  if(!chave || !valor || valor<=0){alert('Informe chave PIX e valor.');return}
  if(valor>Session.saldo){alert('Saldo insuficiente.');return}
  Session.saldo-=valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'PIX', descricao:`Chave ${chave}`, valor});
  renderHistorico();
  alert('PIX enviado (simulação).');
}

function pagarQRCode(){
  const codigo=document.getElementById('qr-codigo').value.trim();
  if(!codigo){alert('Cole o conteúdo do QR Code.');return}
  const valor = Math.floor(10+Math.random()*490);
  if(valor>Session.saldo){alert('Saldo insuficiente.');return}
  Session.saldo-=valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'QR Code', descricao:`QR ${codigo.slice(0,6)}...`, valor});
  renderHistorico();
  alert('Pagamento via QR Code concluído (simulação).');
}

// Tabs simples
function ativarAba(id){
  document.querySelectorAll('.pane').forEach(p=>p.style.display='none');
  document.getElementById(id).style.display='block';
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelector(`[data-tab='${id}']`).classList.add('active');
}