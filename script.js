
function login(){
  let user = document.getElementById('usuario').value;
  let pass = document.getElementById('senha').value;
  if(user!=="DanielKascher" || pass!=="K@scher123"){
    alert("Usuário ou senha incorretos.");
    return;
  }
  sessionStorage.setItem('banco','Banco 01');
  sessionStorage.setItem('agencia','0001');
  sessionStorage.setItem('saldo',50000000);
  sessionStorage.setItem('usuario', user);
  window.location='welcome.html';
}
function toggleSenha(){
  let f = document.getElementById('senha');
  f.type = (f.type==='password')?'text':'password';
}
