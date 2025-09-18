let telaAtual = 'dashboard';

function typeWriterEffect(id, text, speed=70){ let i=0; function step(){ if(i<text.length){ document.getElementById(id).textContent += text.charAt(i); i++; setTimeout(step,speed);} } step(); }
window.onload=()=>{typeWriterEffect("typewriter","Bem-vindo ao Banco Digital Infinity Fiber");};

function entrar(){ document.getElementById("welcome").style.display="none"; document.getElementById("app").style.display="block"; abrirDashboard(); }

function voltarDashboard(){ abrirDashboard(); }

function abrirDashboard(){
  telaAtual='dashboard';
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
      <div class="card" onclick="abrirTransferencia()">
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
  telaAtual='clientes';
  document.getElementById("titulo").textContent="Clientes";
  document.getElementById("conteudo").innerHTML=`
    <h3>Lista de Clientes</h3>
    <ul>
      <li>Infinity Fiber Digital</li>
      <li>Maria Thereza Caldas Braga</li>
      <li>Gustavo Caldas Braga</li>
      <li>Daniel Braga Kascher</li>
    </ul>`;
}

// TRANSFERÊNCIA
function abrirTransferencia(){
  telaAtual='transferencia';
  document.getElementById("titulo").textContent="Transferência";
  document.getElementById("conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); simularTransferencia();">
      <div>
        <label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div>
        <label>Destinatário</label>
        <select id="cliente">
          <option>Infinity Fiber Digital</option>
          <option>Maria Thereza Caldas Braga</option>
          <option>Gustavo Caldas Braga</option>
          <option>Daniel Braga Kascher</option>
        </select>
      </div>
      <div>
        <label>Valor</label>
        <input type="number" id="valor" placeholder="Ex: 500.00" />
      </div>
      <button class="btn" type="submit">Enviar</button>
      <p id="mensagem"></p>
    </form>`;
}

function simularTransferencia(){
  const tipo=document.getElementById("tipo").value;
  const cliente=document.getElementById("cliente").value;
  const valor=parseFloat(document.getElementById("valor").value||0);
  const msg=document.getElementById("mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  const agora=new Date(); const h=agora.getHours(); const d=agora.getDay();
  if(tipo==="PIX"){ msg.textContent=`PIX de R$${valor.toFixed(2)} realizado com sucesso para ${cliente}`; return; }
  if(d===0||d===6||h<8||h>17){ msg.textContent=`Transferência ${tipo} agendada para o próximo dia útil.`; }
  else{ msg.textContent=`Transferência ${tipo} de R$${valor.toFixed(2)} realizada com sucesso para ${cliente}`; }
}

// PAGAMENTOS
function abrirPagamentos(){
  telaAtual='pagamentos';
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
