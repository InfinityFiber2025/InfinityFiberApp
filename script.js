// Navigation & Session
function go(u){ window.location.href = u }
function back(){ history.back() }
function logout(){ go('index.html') }

const Session = {
  titular: 'Cliente Infinity',
  agencia: '0001',
  conta: '123456-7',
  saldo: 125000.00 // use para níveis do cartão
};

function mountHeader(){
  const h = document.querySelector('[data-header]'); if(!h) return;
  const brand = h.querySelector('[data-brand]');
  const acct = h.querySelector('[data-acct]');
  const saldo = h.querySelector('[data-saldo]');
  if(brand) brand.textContent = 'Banco Digital Infinity Fiber';
  if(acct) acct.textContent = `Ag. ${Session.agencia} • Cc ${Session.conta}`;
  if(saldo) saldo.textContent = `Saldo: R$ ${Session.saldo.toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
}
document.addEventListener('DOMContentLoaded', mountHeader);

// -------- Login (mostrar senha) --------
function toggleSenha(id, btnId){
  const input = document.getElementById(id);
  const btn = document.getElementById(btnId);
  if(!input || !btn) return;
  if(input.type === 'password'){ input.type = 'text'; btn.textContent = 'Ocultar senha'; }
  else { input.type = 'password'; btn.textContent = 'Mostrar senha'; }
}
function loginSubmit(e){
  e.preventDefault();
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value.trim();
  if(!u || !p){ alert('Informe usuário e senha.'); return }
  go('dashboard.html');
}

// -------- Cartões com níveis (saldo) --------
function gerarCartao(){
  let nivel='Level', bg='linear-gradient(135deg,#0a5bd8,#083a93)';
  if(Session.saldo > 250000){ nivel='Unlimited'; bg='linear-gradient(135deg,#000,#434343)'; }
  else if(Session.saldo > 50000){ nivel='Black'; bg='linear-gradient(135deg,#232526,#414345)'; }
  const num = [...Array(4)].map(()=>Math.floor(1000+Math.random()*9000)).join(' ');
  const val = String(Math.floor(Math.random()*12+1)).padStart(2,'0') + '/' + String(new Date().getFullYear()+5).slice(2);
  const cvv = String(Math.floor(100+Math.random()*900));
  const div = document.getElementById('cartao'); if(!div) return;
  div.style.background = bg;
  div.innerHTML = `
    <div class="row"><div>Infinity Fiber</div><div>${nivel}</div></div>
    <div class="number">${num}</div>
    <div class="row">
      <div><div class="label">Validade</div><div class="value">${val}</div></div>
      <div><div class="label">CVV</div><div class="value">${cvv}</div></div>
    </div>
    <div style="margin-top:14px;font-size:14px">${Session.titular}</div>
  `;
}

// -------- Investimentos (JSON) --------
async function carregarInvestimentos(){
  const tbody = document.getElementById('lista-invest'); if(!tbody) return;
  try{
    const resp = await fetch('investimentos.json', {cache:'no-store'});
    const data = await resp.json();
    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${item.empresa}</td><td>${item.tipo}</td><td>${item.rentabilidade}%</td><td>${item.risco}</td>
        <td><input type="number" min="100" placeholder="Valor R$" id="val-${item.id}"></td>
        <td><button class="btn" style="padding:6px 10px;font-size:13px" onclick='simular(${JSON.stringify(item)})'>Investir</button></td>
      </tr>
    `).join('');
  }catch(e){
    tbody.innerHTML = '<tr><td colspan="6">Falha ao carregar investimentos.</td></tr>';
  }
}
function simular(item){
  const v = document.getElementById('val-'+item.id).value;
  if(!v || v<100){ alert('Digite um valor acima de R$ 100'); return }
  const r = (v * item.rentabilidade / 100).toFixed(2);
  alert(`Simulação: Investindo R$ ${Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2})} em ${item.empresa}, retorno estimado em 1 ano: R$ ${Number(r).toLocaleString('pt-BR',{minimumFractionDigits:2})}`);
}

// -------- Pagamentos --------
let PagamentosHist = [];
async function carregarHistorico(){
  const el = document.getElementById('hist-body'); if(!el) return;
  try{
    const resp = await fetch('pagamentos.json', {cache:'no-store'});
    PagamentosHist = await resp.json();
  }catch(e){ PagamentosHist = []; }
  renderHistorico();
}
function renderHistorico(){
  const el = document.getElementById('hist-body'); if(!el) return;
  el.innerHTML = PagamentosHist.length ? PagamentosHist.map(p=>`
    <tr><td>${p.data}</td><td>${p.tipo}</td><td>${p.descricao}</td><td>R$ ${Number(p.valor).toLocaleString('pt-BR',{minimumFractionDigits:2})}</td></tr>
  `).join('') : `<tr><td colspan="4" class="small">Sem pagamentos ainda</td></tr>`;
}
function pagarBoleto(){
  const code = document.getElementById('boleto-codigo').value.trim();
  let valor = parseFloat(document.getElementById('boleto-valor').value);
  if(code.length < 30){ alert('Código inválido'); return }
  if(!valor || valor<=0){ valor = Math.floor(100+Math.random()*900) }
  if(valor > Session.saldo){ alert('Saldo insuficiente'); return }
  Session.saldo -= valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'Boleto', descricao:`Boleto ${code.slice(0,6)}...`, valor});
  renderHistorico();
  alert('Boleto pago (simulação).');
}
function enviarPIX(){
  const chave = document.getElementById('pix-chave').value.trim();
  const valor = parseFloat(document.getElementById('pix-valor').value);
  if(!chave || !valor || valor<=0){ alert('Informe chave e valor'); return }
  if(valor > Session.saldo){ alert('Saldo insuficiente'); return }
  Session.saldo -= valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'PIX', descricao:`Chave ${chave}`, valor});
  renderHistorico();
  alert('PIX enviado (simulação).');
}
function pagarQRCode(){
  const qr = document.getElementById('qr-codigo').value.trim();
  if(!qr){ alert('Cole o conteúdo do QR'); return }
  const valor = Math.floor(10+Math.random()*490);
  if(valor > Session.saldo){ alert('Saldo insuficiente'); return }
  Session.saldo -= valor; mountHeader();
  PagamentosHist.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'QR Code', descricao:`QR ${qr.slice(0,6)}...`, valor});
  renderHistorico();
  alert('Pagamento via QR concluído (simulação).');
}

// -------- Transferência com câmera --------
let streamRef = null;
let facialOK = false;

async function abrirCamera(){
  const video = document.getElementById('cam'); if(!video) return;
  try{
    streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio:false });
    video.srcObject = streamRef;
    video.setAttribute('playsinline','true'); // iOS Safari
    await video.play();
    document.getElementById('btn-capturar').disabled = false;
  }catch(e){
    alert('Não foi possível acessar a câmera. Você pode tentar permitir o acesso no navegador.');
  }
}
function capturarFoto(){
  const video = document.getElementById('cam');
  const canvas = document.getElementById('snapshot');
  if(!video || !canvas) return;
  const w = video.videoWidth, h = video.videoHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  facialOK = true;
  document.getElementById('status-facial').textContent = 'Validação facial concluída ✔';
  document.getElementById('btn-confirmar').disabled = false;
  pararCamera();
}
function pararCamera(){
  if(streamRef){
    streamRef.getTracks().forEach(t=>t.stop());
    streamRef = null;
  }
}
function confirmarTransferencia(){
  const destino = document.getElementById('transf-destino').value.trim();
  const valor = parseFloat(document.getElementById('transf-valor').value);
  const tipo = document.getElementById('transf-tipo').value;
  if(!destino || !valor || valor<=0){ alert('Informe destino e valor'); return }
  if(!facialOK){ alert('Valide a transferência com reconhecimento facial'); return }
  if(valor > Session.saldo){ alert('Saldo insuficiente'); return }
  Session.saldo -= valor; mountHeader();
  alert(`Transferência ${tipo} de R$ ${valor.toLocaleString('pt-BR',{minimumFractionDigits:2})} para ${destino} concluída (simulação).`);
  facialOK = false; document.getElementById('btn-confirmar').disabled = true;
}

// -------- Empréstimos --------
function simularEmprestimo(){
  const valor = parseFloat(document.getElementById('emp-valor').value);
  const meses = parseInt(document.getElementById('emp-prazo').value, 10);
  const taxa = parseFloat(document.getElementById('emp-taxa').value) / 100 / 12; // a.m
  if(!valor || !meses || !taxa){ alert('Preencha valor, prazo e taxa'); return }
  const parcela = (valor * taxa) / (1 - Math.pow(1+taxa, -meses));
  document.getElementById('emp-resultado').textContent = 'Parcela estimada: R$ ' + parcela.toLocaleString('pt-BR',{minimumFractionDigits:2});
}

// -------- Notificações --------
async function carregarNotificacoes(){
  try{
    const resp = await fetch('notificacoes.json', {cache:'no-store'});
    const data = await resp.json();
    const ul = document.getElementById('noti-list');
    ul.innerHTML = data.map(n=>`<li>${n.data} • ${n.texto}</li>`).join('');
  }catch(e){}
}

// -------- Extrato --------
async function carregarExtrato(){
  try{
    const resp = await fetch('extrato.json', {cache:'no-store'});
    const data = await resp.json();
    document.getElementById('extrato-body').innerHTML = data.map(e=>`
      <tr><td>${e.data}</td><td>${e.descricao}</td><td>${e.tipo}</td><td>R$ ${Number(e.valor).toLocaleString('pt-BR',{minimumFractionDigits:2})}</td></tr>
    `).join('');
  }catch(e){}
}