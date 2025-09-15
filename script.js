
const LS_KEY='if_bank_test';
let S={clientes:[],usuario:{login:'DanielKascher',senha:'K@scher123'}};
function save(){localStorage.setItem(LS_KEY,JSON.stringify(S));}
function load(){const d=localStorage.getItem(LS_KEY);if(d)S=JSON.parse(d);}
load();
function login(){const u=document.getElementById('loginUser').value,p=document.getElementById('loginPass').value;
 if(u===S.usuario.login && p===S.usuario.senha){window.location='home.html';}else{alert('Login inválido');}}
function abrirFacial(){//simulação facial
 alert('Reconhecimento facial concluído! Conta aprovada.');
 const c={nome:document.getElementById('cNome').value,cpf:document.getElementById('cCpf').value,email:document.getElementById('cEmail').value,tel:document.getElementById('cTel').value,agencia:'0001',conta:String(Math.floor(100000+Math.random()*900000))+'-7',saldo:5000000000};
 S.clientes=[c];save();window.location='home.html';}
function buscarCliente(){if(S.clientes.length>0){alert('Cliente ativo: '+S.clientes[0].nome+' • Ag '+S.clientes[0].agencia+' • Cc '+S.clientes[0].conta);}
else{alert('Nenhum cliente encontrado!');}}
function irCadastro(){window.location='cadastro.html';}
function fazerTED(){if(S.clientes.length===0){alert('Cadastre cliente antes!');return;}
 const cli=S.clientes[0];const v=parseFloat(document.getElementById('tValor').value);
 if(cli.saldo<v){alert('Saldo insuficiente');return;}cli.saldo-=v;save();alert('TED enviado: '+v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));}
function fazerPIX(){if(S.clientes.length===0){alert('Cadastre cliente antes!');return;}
 const cli=S.clientes[0];const v=parseFloat(document.getElementById('pValor').value);
 if(cli.saldo<v){alert('Saldo insuficiente');return;}cli.saldo-=v;save();alert('PIX enviado: '+v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));}
