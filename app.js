
let clientes=[]; let transacoes=[]; let nextConta=1; let tipoLogado=null; let usuarioLogado=null;

function seed(){
  if(clientes.length===0){
    criarCliente("Maria","maria@teste.com");
    criarCliente("Gustavo","gustavo@teste.com");
    criarCliente("Daniel","daniel@teste.com");
    criarAgendamentos();
  }
}
function criarCliente(nome,email){
  clientes.push({nome,email,conta:String(nextConta++).padStart(6,"0"),saldo:0});
}
function criarAgendamentos(){
  clientes.forEach(c=>{
    transacoes.push({id:Math.random(),para:c.email,valor:200000,status:"pendente"});
  });
}
function abrirLoginAdmin(){
  seed();
  document.getElementById("loginTela").innerHTML=`<h2>Login Admin</h2>
    <button class='btn' onclick='loginAdmin()'>Entrar</button>`;
}
function abrirBemVindoCliente(){
  document.getElementById("loginTela").innerHTML=`<h2>App do Cliente</h2>
    <p>(Em construção)</p><button class='btn' onclick='location.reload()'>Voltar</button>`;
}
function loginAdmin(){ tipoLogado='admin'; document.getElementById("loginTela").style.display='none'; document.getElementById("app").style.display='block'; abrirDashboardAdmin(); }
function voltarDashboard(){ if(tipoLogado==='admin') abrirDashboardAdmin(); }
function abrirDashboardAdmin(){
  document.getElementById("titulo").textContent="Dashboard Admin";
  document.getElementById("conteudo").innerHTML=`
    <button class='btn' onclick='abrirTransacoesAdmin()'>Transações</button>`;
}
function abrirTransacoesAdmin(){
  let html="<h3>Transações</h3><table border=1><tr><th>Destino</th><th>Valor</th><th>Status</th><th>Ação</th></tr>";
  transacoes.forEach(t=>{
    html+=`<tr><td>${t.para}</td><td>${t.valor}</td><td>${t.status}</td><td><button onclick="aprovar(${t.id})">Aprovar</button></td></tr>`;
  });
  html+="</table><button class='btn' onclick='gerarTransacaoTeste()'>Gerar Transação de Teste</button>";
  document.getElementById("conteudo").innerHTML=html;
}
function aprovar(id){ let t=transacoes.find(x=>x.id==id); if(t) t.status="aprovado"; abrirTransacoesAdmin(); }
function gerarTransacaoTeste(){
  const c=clientes[0]; transacoes.push({id:Math.random(),para:c.email,valor:50000,status:"pendente"}); abrirTransacoesAdmin();
}
