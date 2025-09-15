
const LS_KEY='if_bank_final';
let S={clientes:[],usuario:{login:'DanielKascher',senha:'K@scher123'},cartao:null};
function save(){localStorage.setItem(LS_KEY,JSON.stringify(S));}
function load(){const d=localStorage.getItem(LS_KEY);if(d)S=JSON.parse(d);} load();

function login(){const u=document.getElementById('loginUser').value,p=document.getElementById('loginPass').value;
 if(u===S.usuario.login && p===S.usuario.senha){window.location='home.html';}else{alert('Login inválido');}}

function abrirFacial(){
 alert('Reconhecimento facial concluído! Conta aprovada.');
 const c={nome:document.getElementById('cNome').value,cpf:document.getElementById('cCpf').value,email:document.getElementById('cEmail').value,tel:document.getElementById('cTel').value,agencia:'0001',conta:String(Math.floor(100000+Math.random()*900000))+'-7',saldo:5000000000};
 S.clientes=[c];save();window.location='home.html';}

function buscarCliente(){if(S.clientes.length>0){alert('Cliente ativo: '+S.clientes[0].nome+' • Ag '+S.clientes[0].agencia+' • Cc '+S.clientes[0].conta);}
 else{alert('Nenhum cliente encontrado!');}}
function irCadastro(){window.location='cadastro.html';}

function fazerTED(){
 if(S.clientes.length===0){alert('Cadastre cliente antes!');return;}
 const cli=S.clientes[0];const v=parseFloat(document.getElementById('tValor').value);
 if(cli.saldo<v){alert('Saldo insuficiente');return;}cli.saldo-=v;save();
 alert('TED enviado: '+v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));}

function fazerPIX(){
 if(S.clientes.length===0){alert('Cadastre cliente antes!');return;}
 const cli=S.clientes[0];const v=parseFloat(document.getElementById('pValor').value);
 if(cli.saldo<v){alert('Saldo insuficiente');return;}cli.saldo-=v;save();
 alert('PIX enviado: '+v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));}

/* Cartões virtuais */
function randDigits(n){return Array.from({length:n},()=>Math.floor(Math.random()*10)).join('');}
function chunkPan(p){return p.replace(/(\d{4})(?=\d)/g,'$1 ').trim();}
function genCard(tipo,modo){
 const pan=randDigits(16),cvv=randDigits(3);
 const mm=String(Math.floor(1+Math.random()*12)).padStart(2,'0');const yy=String(new Date().getFullYear()+3).slice(-2);
 S.cartao={tipo,pan,cvv,exp:`${mm}/${yy}`,modo,nome:(S.clientes[0]?.nome||'Cliente Infinity')};save();renderCard('vc_wrap');}
function renderCard(id){
 const el=document.getElementById(id);if(!el)return;
 if(!S.cartao){el.innerHTML='<div class="small">Nenhum cartão gerado ainda.</div>';return;}
 const klass=S.cartao.tipo==='Lite'?'card-lite':(S.cartao.tipo==='Black'?'card-black':'card-unlimited');
 el.innerHTML=`<div class="vcard ${klass}">
   <div class="row2"><div class="brand">∞ Infinity Fiber</div><div class="meta">${S.cartao.modo}</div></div>
   <div class="pan">${chunkPan(S.cartao.pan)}</div>
   <div class="row2"><div class="meta">Val: ${S.cartao.exp} • CVV: <span id='cvv'>***</span></div>
   <button class="copybtn" onclick="navigator.clipboard.writeText('${S.cartao.pan}')">Copiar</button></div>
   <div class="row2"><div class="name">${S.cartao.nome}</div>
   <button class="copybtn" onclick="toggleCVV()">Mostrar CVV</button></div></div>`;}
function toggleCVV(){const el=document.getElementById('cvv');if(!el)return;
 el.textContent=(el.textContent==='***')?S.cartao.cvv:'***';}
