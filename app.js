const modelosPath = './models';
let streamGlobal = null;
let clienteSelecionadoParaFoto = null;

const clientes = [
  { nome:"Infinity Fiber Digital", endereco:"Av. Padrão, 1000 - Centro - RJ", cpf:"00.000.000/0000-00", banco:"Infinity Fiber Bank", agencia:"0001", conta:"000000-1", pix:"contato@infinityfiber.com", email:"contato@infinityfiber.com", foto:null },
  { nome:"Maria Thereza Caldas Braga", endereco:"Rua Silvério de Medeiros 140 - Moura Brasil - Três Rios - RJ CEP: 25821-470", cpf:"08819784777", banco:"Banco do Brasil", agencia:"315-8", conta:"55194-5", foto:null },
  { nome:"Gustavo Caldas Braga", endereco:"Rua Silvério Medeiros 140 - Moura Brasil - Três Rios - RJ CEP: 25.821.470", cpf:"006.259.017.03", identidade:"08.492.475-2 Detran", banco:"Santander", agencia:"3752", conta:"01074998-7", pix:"00625901703 (CPF)", foto:null },
  { nome:"Daniel Braga Kascher", endereco:"Rua Engenheiro Zoroastro Torres 196/301 - Santo Antonio - BH- MG CEP: 30350-260", cpf:"05379292666", identidade:"9341874", banco:"Banco do Brasil", agencia:"3857-1", conta:"107977-8", pix:"danielkascher@hotmail.com", email:"danielkascher@hotmail.com", foto:null }
];

function typeWriterEffect(id,text,speed=70){let i=0;function step(){if(i<text.length){document.getElementById(id).textContent+=text.charAt(i);i++;setTimeout(step,speed);}}step();}
window.onload=()=>{typeWriterEffect("typewriter","Bem-vindo ao Banco Digital Infinity Fiber");};

function entrar(){document.getElementById("welcome").style.display="none";document.getElementById("app").style.display="block";abrirClientes();}

function abrirClientes(){const ctn=document.getElementById("conteudo");ctn.innerHTML="<h3>Clientes</h3>"+clientes.map((c,i)=>`<div><b>${c.nome}</b> - ${c.banco} <button onclick="abrirFicha(${i})">Abrir</button></div>`).join("");}

function abrirFicha(i){const c=clientes[i];const foto=c.foto?`<img src="${c.foto}" width="100"/>`:"(sem foto)";const html=`<h3>${c.nome}</h3><p>${c.endereco}</p><p>CPF:${c.cpf}</p><p>Banco:${c.banco} Ag:${c.agencia} Conta:${c.conta}</p><p>Pix:${c.pix||""}</p><p>Email:${c.email||""}</p><div>${foto}</div><button onclick="capturar(${i})">Capturar Foto</button><button onclick="abrirTransferencia(${i})">Transferência</button>`;abrirModal(html);}

function abrirModal(html){document.getElementById("modal-body").innerHTML=html;document.getElementById("modal").setAttribute("aria-hidden","false");}
function fecharModal(){document.getElementById("modal").setAttribute("aria-hidden","true");}

async function capturar(i){clienteSelecionadoParaFoto=i;await iniciarCamera();document.getElementById("camera-area").style.display="flex";}
async function iniciarCamera(){streamGlobal=await navigator.mediaDevices.getUserMedia({video:true});document.getElementById("video").srcObject=streamGlobal;}
function pararCamera(){if(streamGlobal){streamGlobal.getTracks().forEach(t=>t.stop());}document.getElementById("camera-area").style.display="none";}
function capturarFrame(){const v=document.getElementById("video");const c=document.getElementById("canvas");c.width=v.videoWidth;c.height=v.videoHeight;const ctx=c.getContext("2d");ctx.drawImage(v,0,0);const data=c.toDataURL();clientes[clienteSelecionadoParaFoto].foto=data;alert("Foto capturada!");pararCamera();}

function abrirTransferencia(i){fecharModal();const ctn=document.getElementById("conteudo");ctn.innerHTML=`<h3>Transferência</h3><label>Cliente:<select id="dest">${clientes.map((c,j)=>`<option value="${j}">${c.nome}</option>`).join("")}</select></label><br><label>Tipo:<select id="tipo"><option>PIX</option><option>TED</option><option>DOC</option></select></label><br><label>Valor:<input id="valor" type="number"/></label><br><button onclick="processar()">Enviar</button><p id="msg"></p>`;}
function processar(){const iDest=parseInt(document.getElementById("dest").value);const tipo=document.getElementById("tipo").value;const valor=parseFloat(document.getElementById("valor").value);const msg=document.getElementById("msg");if(!valor||valor<=0){msg.textContent="Valor inválido";return;}const agora=new Date();const h=agora.getHours(),d=agora.getDay();if(tipo==="PIX"){msg.textContent=`PIX de R$${valor} enviado para ${clientes[iDest].nome}`;return;}if(d===0||d===6||h<8||h>17){msg.textContent=`Transferência ${tipo} agendada`;return;}msg.textContent=`Transferência ${tipo} de R$${valor} realizada para ${clientes[iDest].nome}`;}
