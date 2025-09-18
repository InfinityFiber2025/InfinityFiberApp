const clientes = [
  { id: 1, nome: "Maria Souza", conta: "0001-1", saldo: 5000 },
  { id: 2, nome: "João Pereira", conta: "0001-2", saldo: 3200 },
  { id: 3, nome: "Daniel Kascher", conta: "0001-3", saldo: 7800 }
];

function entrar() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").style.display = "block";

  let lista = "<h3>Clientes Cadastrados</h3><ul>";
  clientes.forEach(c => {
    lista += `<li>${c.nome} - Conta: ${c.conta} - Saldo: R$ ${c.saldo}</li>`;
  });
  lista += "</ul>";
  document.getElementById("clientes").innerHTML = lista;
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
    mensagem.innerText = `PIX de R$${valor} realizado com sucesso para ${clientes[clienteId-1].nome}`;
    return;
  }

  if (dia === 0 || dia === 6) {
    mensagem.innerText = `Transferência via ${tipo} agendada para o próximo dia útil.`;
    return;
  }

  if (hora >= 8 && hora <= 17) {
    mensagem.innerText = `Transferência via ${tipo} de R$${valor} realizada com sucesso para ${clientes[clienteId-1].nome}`;
  } else {
    mensagem.innerText = `Transferência via ${tipo} agendada para o próximo dia útil.`;
  }
}