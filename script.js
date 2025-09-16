
function login(){
  let user = document.getElementById('usuario').value;
  let pass = document.getElementById('senha').value;
  if(user=="" || pass==""){
    alert("Preencha usuário e senha para continuar.");
    return;
  }
  sessionStorage.setItem('banco','Banco 01');
  sessionStorage.setItem('agencia','0001');
  sessionStorage.setItem('saldo',50000000);
  window.location='dashboard.html';
}
function toggleSenha(){
  let f = document.getElementById('senha');
  f.type = (f.type==='password')?'text':'password';
}
