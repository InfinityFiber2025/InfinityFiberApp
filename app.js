let clientes = [
  {nome:"Infinity Fiber Digital", banco:"Banco Infinity", agencia:"0001", conta:"12345-6", pix:"infinity@fiber.com"},
  {nome:"Maria Thereza Caldas Braga", banco:"Banco do Brasil", agencia:"315-8", conta:"55194-5", pix:"08819784777"},
  {nome:"Gustavo Caldas Braga", banco:"Santander", agencia:"3752", conta:"01074998-7", pix:"00625901703"},
  {nome:"Daniel Braga Kascher", banco:"Banco do Brasil", agencia:"3857-1", conta:"107977-8", pix:"danielkascher@hotmail.com"}
];

function typeWriterEffect(id, text, speed=70){ let i=0; function step(){ if(i<text.length){ document.getElementById(id).textContent += text.charAt(i); i++; setTimeout(step,speed);} } step(); }
window.onload=()=>{typeWriterEffect("typewriter","Bem-vindo ao Banco Digital Infinity Fiber");};

function entrar(){ document.getElementById("welcome").style.display="none"; document.getElementById("app").style.display="block"; abrirDashboard(); }

function voltarDashboard(){ abrirDashboard(); }

function abrirDashboard(){
  document.getElementById("titulo").textContent="Infinity Fiber Digital";
  document.getElementById("conteudo").innerHTML=`
    <div style="text-align:center;">
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">R$ 50.000,00</p>
    </div>
    <div class="card-grid">
      <div class="card" onclick="abrirClientes()">
        <div class="card-icon">👤</div>
        <div>Clientes</div>
      </div>
      <div class="card" onclick="abrirTransferenciaNovo()">
        <div class="card-icon">💸</div>
        <div>Transferência</div>
      </div>
      <div class="card" onclick="abrirPagamentos()">
        <div class="card-icon">📷</div>
        <div>Pagamentos</div>
      </div>
    </div>`;
}

// CLIENTES
function abrirClientes(){
  document.getElementById("titulo").textContent="Clientes";
  let html="<h3>Lista de Clientes</h3><ul>";
  clientes.forEach((c,i)=>{
    html+=`<li onclick="abrirTransferenciaCliente(${i})">${c.nome}</li>`;
  });
  html+="</ul>";
  document.getElementById("conteudo").innerHTML=html;
}

// TRANSFERÊNCIA PARA CLIENTE EXISTENTE
function abrirTransferenciaCliente(i){
  const c=clientes[i];
  document.getElementById("titulo").textContent="Transferência — "+c.nome;
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); simularTransferencia('${c.nome}',true);">
      <div><label>Banco</label><input value="${c.banco}" disabled /></div>
      <div><label>Agência</label><input value="${c.agencia}" disabled /></div>
      <div><label>Conta</label><input value="${c.conta}" disabled /></div>
      <div><label>Pix</label><input value="${c.pix}" disabled /></div>
      <div><label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div><label>Valor</label><input type="number" id="valor" placeholder="Ex: 500.00" /></div>
      <button class="btn" type="submit">Enviar</button>
      <p id="mensagem"></p>
    </form>`;
}

// TRANSFERÊNCIA PARA NOVO CLIENTE
function abrirTransferenciaNovo(){
  document.getElementById("titulo").textContent="Transferência — Novo Cliente";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); simularTransferenciaNovo();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Banco</label><input id="novoBanco" required /></div>
      <div><label>Agência</label><input id="novoAgencia" required /></div>
      <div><label>Conta</label><input id="novoConta" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <div><label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div><label>Valor</label><input type="number" id="valor" required /></div>
      <button class="btn" type="submit">Enviar</button>
      <p id="mensagem"></p>
    </form>`;
}

function simularTransferencia(nome, existente=false){
  const tipo=document.getElementById("tipo").value;
  const valor=parseFloat(document.getElementById("valor").value||0);
  const msg=document.getElementById("mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  const agora=new Date(); const h=agora.getHours(); const d=agora.getDay();
  if(tipo==="PIX"){ msg.textContent=`PIX de R$${valor.toFixed(2)} realizado com sucesso para ${nome}`; return; }
  if(d===0||d===6||h<8||h>17){ msg.textContent=`Transferência ${tipo} agendada para o próximo dia útil.`; }
  else{ msg.textContent=`Transferência ${tipo} de R$${valor.toFixed(2)} realizada com sucesso para ${nome}`; }
}

function simularTransferenciaNovo(){
  const nome=document.getElementById("novoNome").value;
  const banco=document.getElementById("novoBanco").value;
  const agencia=document.getElementById("novoAgencia").value;
  const conta=document.getElementById("novoConta").value;
  const pix=document.getElementById("novoPix").value;
  const tipo=document.getElementById("tipo").value;
  const valor=parseFloat(document.getElementById("valor").value||0);
  const msg=document.getElementById("mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  const agora=new Date(); const h=agora.getHours(); const d=agora.getDay();
  let resultado="";
  if(tipo==="PIX"){ resultado=`PIX de R$${valor.toFixed(2)} realizado com sucesso para ${nome}`; }
  else if(d===0||d===6||h<8||h>17){ resultado=`Transferência ${tipo} agendada para o próximo dia útil.`; }
  else{ resultado=`Transferência ${tipo} de R$${valor.toFixed(2)} realizada com sucesso para ${nome}`; }
  msg.textContent=resultado;

  // Opção de salvar
  msg.innerHTML+=`<br><button class='btn' onclick="salvarCliente('${nome}','${banco}','${agencia}','${conta}','${pix}')">Salvar no Cadastro de Clientes</button>`;
}

function salvarCliente(nome,banco,agencia,conta,pix){
  clientes.push({nome,banco,agencia,conta,pix});
  alert(nome+" salvo no cadastro de clientes!");
  abrirClientes();
}

// PAGAMENTOS
function abrirPagamentos(){
  document.getElementById("titulo").textContent="Pagamentos";
  document.getElementById("conteudo").innerHTML=`
    <div class="card-grid">
      <div class="card" onclick="alert('Gerar QR Code ainda em desenvolvimento')">
        <div class="card-icon">🔳</div>
        <div>Gerar QR Code</div>
      </div>
      <div class="card" onclick="alert('Ler QR Code ainda em desenvolvimento')">
        <div class="card-icon">📷</div>
        <div>Ler QR Code</div>
      </div>
    </div>`;
}
