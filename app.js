const clientes = [
  {
    nome: "Maria Thereza Caldas Braga",
    endereco: "Rua Silvério de Medeiros 140 - Moura Brasil - Três Rios - RJ CEP: 25821-470",
    cpf: "08819784777",
    banco: "Banco do Brasil",
    agencia: "315-8",
    conta: "55194-5"
  },
  {
    nome: "Gustavo Caldas Braga",
    endereco: "Rua Silvério Medeiros 140 - Moura Brasil - Três Rios - RJ CEP: 25821-470",
    cpf: "006.259.017.03",
    identidade: "08.492.475-2 Detran",
    banco: "Santander",
    agencia: "3752",
    conta: "01074998-7",
    pix: "00625901703 (CPF)"
  },
  {
    nome: "Daniel Braga Kascher",
    endereco: "Rua Engenheiro Zoroastro Torres 196/301 - Santo Antonio - BH- MG CEP: 30350-260",
    cpf: "05379292666",
    identidade: "9341874",
    banco: "Banco do Brasil",
    agencia: "3857-1",
    conta: "107977-8",
    pix: "danielkascher@hotmail.com"
  }
];

function typeWriterEffect(elementId, text, speed) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      document.getElementById(elementId).innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

window.onload = function() {
  typeWriterEffect("typewriter", "Bem-vindo ao Banco Digital Infinity Fiber", 80);
};

function entrar() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function mostrarClientes() {
  let html = "<h3>Clientes Cadastrados</h3>";
  clientes.forEach((c, index) => {
    html += `<div style='margin:10px; padding:10px; border:1px solid #0ff; border-radius:8px;'>
      <strong>${c.nome}</strong><br>
      <button onclick='detalhesCliente(${index})'>Ver detalhes</button>
    </div>`;
  });
  document.getElementById("conteudo").innerHTML = html;
}

function detalhesCliente(index) {
  const c = clientes[index];
  let html = `<h3>Detalhes do Cliente</h3>
    <p><strong>Nome:</strong> ${c.nome}</p>
    <p><strong>Endereço:</strong> ${c.endereco}</p>
    <p><strong>CPF:</strong> ${c.cpf}</p>`;

  if (c.identidade) html += `<p><strong>Identidade:</strong> ${c.identidade}</p>`;
  html += `<p><strong>Banco:</strong> ${c.banco}</p>
    <p><strong>Agência:</strong> ${c.agencia}</p>
    <p><strong>Conta:</strong> ${c.conta}</p>`;

  if (c.pix) html += `<p><strong>Pix:</strong> ${c.pix}</p>`;

  html += `<button onclick='mostrarClientes()'>Voltar</button>`;

  document.getElementById("conteudo").innerHTML = html;
}

function mostrarTransferencia() {
  let html = `<h3>Transferência</h3>
    <select id="cliente">
      ${clientes.map((c, i) => `<option value="${i}">${c.nome}</option>`).join("")}
    </select>
    <select id="tipo">
      <option value="PIX">PIX</option>
      <option value="TED">TED</option>
      <option value="DOC">DOC</option>
    </select>
    <input type="number" id="valor" placeholder="Valor">
    <button onclick="transferir()">Enviar</button>
    <p id="mensagem"></p>`;

  document.getElementById("conteudo").innerHTML = html;
}

function transferir() {
  const clienteId = document.getElementById("cliente").value;
  const tipo = document.getElementById("tipo").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const mensagem = document.getElementById("mensagem");

  if (!valor || valor <= 0) {
    mensagem.innerText = "Informe um valor válido.";
    return;
  }

  const agora = new Date();
  const hora = agora.getHours();
  const dia = agora.getDay(); // 0 = domingo, 6 = sábado

  if (tipo === "PIX") {
    mensagem.innerText = `PIX de R$${valor} realizado com sucesso para ${clientes[clienteId].nome}`;
    return;
  }

  if (dia === 0 || dia === 6) {
    mensagem.innerText = `Transferência via ${tipo} agendada para o próximo dia útil.`;
    return;
  }

  if (hora >= 8 && hora <= 17) {
    mensagem.innerText = `Transferência via ${tipo} de R$${valor} realizada com sucesso para ${clientes[clienteId].nome}`;
  } else {
    mensagem.innerText = `Transferência via ${tipo} agendada para o próximo dia útil.`;
  }
}