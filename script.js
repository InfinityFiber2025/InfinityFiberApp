// --- Basic Navigation & Session state (localStorage) ---
function go(u){ window.location.href = u }
function back(){ history.back() }
function logout(){ localStorage.clear(); go('index.html') }

const DEFAULT_STATE = {
  banco: 'Banco 01', agencia: '0001', usuario: 'DanielKascher', saldo: 50000000,
  extrato: [{data:'14/09/2025', descricao:'Depósito inicial', tipo:'Crédito', valor:50000000}],
  pagamentos: [], notificacoes: [
    {data:'15/09', texto:'PIX recebido — R$ 1.250,00'},
    {data:'14/09', texto:'Fatura do cartão disponível'},
  ]
};

function ensureState(){
  if(!localStorage.getItem('state')){
    localStorage.setItem('state', JSON.stringify(DEFAULT_STATE));
  }
  return JSON.parse(localStorage.getItem('state'));
}
function saveState(st){ localStorage.setItem('state', JSON.stringify(st)); }
function formatBR(v){ return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2}) }

function mountHeader(){
  const st = ensureState();
  const h = document.querySelector('[data-header]'); if(!h) return;
  const b = h.querySelector('[data-brand]'); if(b) b.textContent = 'Banco Digital Infinity Fiber';
  const a = h.querySelector('[data-acct]'); if(a) a.textContent = `Banco ${st.banco.split(' ')[1]} • Ag. ${st.agencia}`;
  const s = h.querySelector('[data-saldo]'); if(s) s.textContent = `Saldo: R$ ${formatBR(st.saldo)}`;
}

// --- Login with fixed credentials + welcome ---
function toggleSenha(id, btnId){
  const i = document.getElementById(id);
  const b = document.getElementById(btnId);
  if(i.type==='password'){ i.type='text'; b.textContent='Ocultar senha' } else { i.type='password'; b.textContent='Mostrar senha' }
}
function loginSubmit(e){
  e.preventDefault();
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value;
  if(u!=='DanielKascher' || p!=='K@scher123'){ alert('Usuário ou senha incorretos.'); return }
  // reset state each login
  localStorage.removeItem('state'); ensureState();
  go('welcome.html');
}

// --- Extrato ---
function loadExtrato(){
  const st = ensureState();
  const tbody = document.getElementById('extrato-body'); if(!tbody) return;
  tbody.innerHTML = st.extrato.map(e=>`
    <tr><td>${e.data}</td><td>${e.descricao}</td><td>${e.tipo}</td><td>R$ ${formatBR(e.valor)}</td></tr>
  `).join('');
}

// --- Pagamentos ---
function carregarHistorico(){
  const st = ensureState();
  const el = document.getElementById('hist-body'); if(!el) return;
  el.innerHTML = (st.pagamentos.length? st.pagamentos.map(p=>`
    <tr><td>${p.data}</td><td>${p.tipo}</td><td>${p.descricao}</td><td>R$ ${formatBR(p.valor)}</td></tr>
  `).join('') : `<tr><td colspan="4" class="small">Sem pagamentos ainda</td></tr>`);
}
function addExtrato(tipo, desc, valor, debitar=true){
  const st = ensureState();
  const hoje = new Date();
  const data = hoje.toLocaleDateString('pt-BR');
  st.extrato.unshift({data, descricao:desc, tipo: debitar?'Débito':'Crédito', valor});
  if(debitar){ st.saldo -= valor } else { st.saldo += valor }
  saveState(st); mountHeader();
}
function pagarBoleto(){
  const code = document.getElementById('boleto-codigo').value.trim();
  let valor = parseFloat(document.getElementById('boleto-valor').value);
  if(code.length < 30){ alert('Código inválido'); return }
  if(!valor || valor<=0){ valor = Math.floor(100+Math.random()*900) }
  const st = ensureState();
  if(valor > st.saldo){ alert('Saldo insuficiente'); return }
  st.pagamentos.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'Boleto', descricao:`Boleto ${code.slice(0,6)}...`, valor});
  saveState(st);
  addExtrato('Boleto', `Pagamento boleto ${code.slice(0,6)}...`, valor, true);
  carregarHistorico();
  alert('Boleto pago (simulação).');
}
function enviarPIX(){
  const chave = document.getElementById('pix-chave').value.trim();
  const valor = parseFloat(document.getElementById('pix-valor').value);
  if(!chave || !valor || valor<=0){ alert('Informe chave e valor'); return }
  const st = ensureState();
  if(valor > st.saldo){ alert('Saldo insuficiente'); return }
  st.pagamentos.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'PIX', descricao:`Chave ${chave}`, valor});
  saveState(st);
  addExtrato('PIX', `PIX para ${chave}`, valor, true);
  carregarHistorico();
  alert('PIX enviado (simulação).');
}
function pagarQRCode(){
  const qr = document.getElementById('qr-codigo').value.trim();
  if(!qr){ alert('Cole o conteúdo do QR'); return }
  const valor = Math.floor(10+Math.random()*490);
  const st = ensureState();
  if(valor > st.saldo){ alert('Saldo insuficiente'); return }
  st.pagamentos.unshift({data:new Date().toLocaleDateString('pt-BR'), tipo:'QR Code', descricao:`QR ${qr.slice(0,6)}...`, valor});
  saveState(st);
  addExtrato('QR', `Pagamento via QR ${qr.slice(0,6)}...`, valor, true);
  carregarHistorico();
  alert('Pagamento via QR concluído (simulação).');
}

// --- Transferência com câmera ---
let streamRef=null, facialOK=false;
async function abrirCamera(){
  const video = document.getElementById('cam'); if(!video) return;
  try{
    streamRef = await navigator.mediaDevices.getUserMedia({ video:{facingMode:'user'}, audio:false });
    video.srcObject = streamRef; video.setAttribute('playsinline','true'); await video.play();
    document.getElementById('btn-capturar').disabled=false;
  }catch(e){ alert('Não foi possível acessar a câmera. Permita o acesso no navegador.'); }
}
function capturarFoto(){
  const video=document.getElementById('cam'); const canvas=document.getElementById('snapshot');
  if(!video||!canvas) return;
  canvas.width=video.videoWidth; canvas.height=video.videoHeight;
  canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
  facialOK=true; document.getElementById('status-facial').textContent='Validação facial concluída ✔';
  document.getElementById('btn-confirmar').disabled=false; pararCamera();
}
function pararCamera(){ if(streamRef){ streamRef.getTracks().forEach(t=>t.stop()); streamRef=null; } }
function confirmarTransferencia(){
  const tipo = document.getElementById('transf-tipo').value;
  const destino = document.getElementById('transf-destino').value.trim();
  const valor = parseFloat(document.getElementById('transf-valor').value);
  if(!destino || !valor || valor<=0){ alert('Informe destino e valor'); return }
  const st = ensureState();
  if(!facialOK){ alert('Valide com reconhecimento facial'); return }
  if(valor > st.saldo){ alert('Saldo insuficiente'); return }
  addExtrato('Transferência', `${tipo} para ${destino}`, valor, true);
  alert(`Transferência ${tipo} de R$ ${formatBR(valor)} para ${destino} concluída (simulação).`);
  facialOK=false; document.getElementById('btn-confirmar').disabled=true;
}

// --- Empréstimos ---
function simularEmprestimo(){
  const valor=parseFloat(document.getElementById('emp-valor').value);
  const meses=parseInt(document.getElementById('emp-prazo').value,10);
  const taxa=(parseFloat(document.getElementById('emp-taxa').value)||0)/100/12;
  if(!valor||!meses||!taxa){ alert('Preencha valor, prazo e taxa'); return }
  const parcela=(valor*taxa)/(1-Math.pow(1+taxa,-meses));
  document.getElementById('emp-resultado').textContent='Parcela estimada: R$ '+formatBR(parcela);
}

// --- Investimentos (static JSON) ---
async function carregarInvestimentos(){
  try{
    const resp=await fetch('investimentos.json',{cache:'no-store'});
    const data=await resp.json();
    const tbody=document.getElementById('lista-invest');
    tbody.innerHTML=data.map(item=>`
      <tr>
        <td>${item.empresa}</td><td>${item.tipo}</td><td>${item.rentabilidade}%</td><td>${item.risco}</td>
        <td><input type="number" min="100" placeholder="Valor R$" id="val-${item.id}"></td>
        <td><button class="btn" style="padding:6px 10px;font-size:13px" onclick='simular(${JSON.stringify(item)})'>Investir</button></td>
      </tr>`).join('');
  }catch(e){}
}
function simular(item){
  const v=document.getElementById('val-'+item.id).value;
  if(!v||v<100){ alert('Digite um valor acima de R$ 100'); return }
  const r=(v*item.rentabilidade/100).toFixed(2);
  alert(`Simulação: R$ ${formatBR(v)} em ${item.empresa} → retorno estimado em 1 ano: R$ ${formatBR(r)}`);
}

// --- Notificações ---
async function carregarNotificacoes(){
  const st = ensureState();
  const ul=document.getElementById('noti-list'); if(!ul) return;
  ul.innerHTML = st.notificacoes.map(n=>`<li>${n.data} • ${n.texto}</li>`).join('');
}

// --- Cards Catalog ---
function maskCard(n){
  return `${n.slice(0,4)} **** **** ${n.slice(-4)}`;
}
function solicitarCartao(tipo){
  const area=document.getElementById('card-render'); if(!area) return;
  const name='Daniel Kascher';
  const number=String(Math.floor(4000+Math.random()*4999))+String(Math.floor(100000000000+Math.random()*899999999999));
  const masked=maskCard(number);
  const valid=('0'+(Math.floor(Math.random()*12)+1)).slice(-2)+'/'+String(new Date().getFullYear()+4).slice(2);
  let klass='pc-blue', label='Level', brand='VISA';
  if(tipo==='Black'){ klass='pc-purple'; label='Black'; brand='MASTERCARD' }
  if(tipo==='Unlimited'){ klass='pc-black'; label='Unlimited'; brand='VISA' }
  area.innerHTML = `
    <div class="preview-card ${klass}">
      <div class="top"><span class="brandmark">Banco Digital Infinity Fiber</span><span class="chip"></span></div>
      <div class="number">${masked}</div>
      <div class="row"><span>${name}</span><span>VAL ${valid}</span></div>
      <div class="row"><span>${label}</span><span class="logo">${brand}</span></div>
    </div>
  `;
}