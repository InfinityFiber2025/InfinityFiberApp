// ===== Estado =====
let clientes = [];
let nextConta=1;
let usuarioLogado=null;
let tipoLogado=null; // "admin" ou "cliente"
let cofreAgencia = 50000000; // R$ 50 milhões
let transacoes = []; // histórico global

// ===== Util =====
const $ = (sel)=>document.querySelector(sel);
function isBusinessDay(date){ const d=date.getDay(); return d!==0 && d!==6; }
function formatDate(d){ return d.toLocaleString(); }
function moeda(v){ return 'R$ '+Number(v).toLocaleString(); }
function gerarSenha(n=8){ return Math.random().toString(36).slice(-n); }

// ===== Base inicial =====
function inicializarClientes(){
  criarCliente("Maria Thereza Caldas Braga","maria@teste.com","08819784777","00625901703",200000,true,null);
  criarCliente("Gustavo Caldas Braga","gustavo@teste.com","00625901703", "00625901703",200000,true,null);
  criarCliente("Daniel Braga Kascher","daniel@teste.com","05379292666","danielkascher@hotmail.com",200000,true,null);
}
function criarCliente(nome,email,cpf,pix,valorInicial,preCadastro=false,fotoDataUrl=null){
  const conta=String(nextConta).padStart(6,"0"); nextConta++;
  const senha=gerarSenha(8);
  const obj={nome,email,senha,cpf,banco:"001",agencia:"0001",conta,pix,saldo:valorInicial,extrato:[],status:"ATIVA", foto: fotoDataUrl};
  clientes.push(obj);
  cofreAgencia -= valorInicial;
  if(!preCadastro) alert(`Cliente criado! Conta ${conta}, Agência 0001. Senha enviada para ${email}: ${senha}`);
}

// ===== PWA: telas raiz =====
function abrirLoginAdmin(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Administrador</h2>
    <form class="form" onsubmit="event.preventDefault(); loginAdmin()">
      <div><label>Usuário</label><input id="adminUser" value="DanielKascher" /></div>
      <div><label>Senha</label><input type="password" id="adminPass" value="K@scher123" /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center;'><button class="btn ghost" onclick="location.reload()">Voltar</button></p>
  `;
}
function abrirBemVindoCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Bem-vindo — App do Cliente</h2>
    <div class="login-options">
      <button class="btn" onclick="abrirLoginCliente()">Já sou cliente</button>
      <button class="btn ghost" onclick="abrirCadastroCliente()">Não sou cliente</button>
      <p style="opacity:.8;margin-top:8px;">Banco 001 — Agência 0001</p>
    </div>
    <p style='text-align:center;'><button class="btn" onclick="location.reload()">Voltar</button></p>
  `;
}

// ===== Login =====
function loginAdmin(){
  const user=$("#adminUser").value, pass=$("#adminPass").value;
  if(user==="DanielKascher" && pass==="K@scher123"){
    usuarioLogado={nome:"Administrador DanielKascher"}; tipoLogado="admin";
    $("#loginTela").style.display="none"; $("#app").style.display="block"; abrirDashboardAdmin();
  } else alert("Usuário ou senha inválidos para administrador.");
}
function abrirLoginCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Login Cliente</h2>
    <form class="form" onsubmit="event.preventDefault(); loginCliente()">
      <div><label>Email</label><input id="loginEmail" required /></div>
      <div><label>Senha</label><input type="password" id="loginSenha" required /></div>
      <button class="btn" type="submit">Entrar</button>
    </form>
    <p style='text-align:center;'><button class="btn ghost" onclick="abrirBemVindoCliente()">Voltar</button></p>
  `;
}
function loginCliente(){
  const email=$("#loginEmail").value, senha=$("#loginSenha").value;
  const c=clientes.find(x=>x.email===email && x.senha===senha);
  if(c){
    usuarioLogado=c; tipoLogado="cliente";
    $("#loginTela").style.display="none"; $("#app").style.display="block"; abrirDashboardCliente();
  } else alert("Email ou senha inválidos.");
}

// ===== Cadastro cliente (com selfie) =====
let stream=null;
async function abrirCadastroCliente(){
  $("#loginTela").innerHTML=`
    <h2 style='text-align:center'>Abrir conta (Cliente)</h2>
    <form class="form" onsubmit="event.preventDefault(); salvarCadastroCliente()">
      <div><label>Nome</label><input id="cadNome" required /></div>
      <div><label>E-mail (login)</label><input id="cadEmail" type="email" required /></div>
      <div><label>CPF</label><input id="cadCPF" required /></div>
      <div><label>Pix</label><input id="cadPix" /></div>
      <div><label>Selfie (biometria)</label>
        <video id="video" class="camera" autoplay playsinline></video>
        <canvas id="canvas" class="canvas"></canvas>
        <div style="margin-top:8px;">
          <button class="btn small" type="button" onclick="capturarSelfie()">Capturar selfie</button>
        </div>
        <img id="previewSelfie" class="avatar" style="margin-top:8px; display:none;" />
      </div>
      <div><label>Saldo Inicial</label><input id="cadSaldo" type="number" value="1000" /></div>
      <button class="btn" type="submit">Criar conta</button>
    </form>
    <p style='text-align:center;'><button class="btn ghost" onclick="abrirBemVindoCliente()">Voltar</button></p>
  `;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const video=$("#video"); video.srcObject=stream;
  } catch(e){ alert("Não foi possível acessar a câmera. Você pode continuar sem selfie."); }
}
function capturarSelfie(){
  const video=$("#video"), canvas=$("#canvas");
  if(!video) return;
  canvas.width=video.videoWidth||320; canvas.height=video.videoHeight||240;
  const ctx=canvas.getContext("2d"); ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const data=canvas.toDataURL("image/png");
  const img=$("#previewSelfie"); img.src=data; img.style.display="inline-block"; img.alt="Selfie";
  img.dataset.selfie = data;
}
function salvarCadastroCliente(){
  const nome=$("#cadNome").value;
  const email=$("#cadEmail").value;
  const cpf=$("#cadCPF").value;
  const pix=$("#cadPix").value;
  const saldo=parseFloat($("#cadSaldo").value||0);
  const selfie=$("#previewSelfie")?.dataset?.selfie || null;
  if(saldo>cofreAgencia){ alert("Cofre insuficiente para este saldo inicial."); return; }
  criarCliente(nome,email,cpf,pix,saldo,false,selfie);
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  alert("Conta criada! Use a senha exibida anteriormente (simulada) para login.");
  location.reload();
}

// ===== Admin Dashboard =====
function voltarDashboard(){ if(tipoLogado==="admin") abrirDashboardAdmin(); else abrirDashboardCliente(); }
function abrirDashboardAdmin(){
  $("#titulo").textContent="Back Office — Infinity Fiber";
  $("#conteudo").innerHTML=`
    <div class='card-grid'>
      <div class='card' onclick='abrirCofre()'><div class='card-icon'>🏦</div><div>Cofre da Agência</div></div>
      <div class='card' onclick='abrirClientesAdmin()'><div class='card-icon'>👥</div><div>Clientes</div></div>
      <div class='card' onclick='abrirTransacoesAdmin()'><div class='card-icon'>🔄</div><div>Transações</div></div>
      <div class='card' onclick='abrirCriarClienteAdmin()'><div class='card-icon'>➕</div><div>Novo Cliente</div></div>
    </div>`;
}
function abrirCofre(){
  $("#titulo").textContent="Cofre da Agência";
  $("#conteudo").innerHTML=`<h3>Saldo do Cofre: ${moeda(cofreAgencia)}</h3><p>Banco 001 — Agência 0001</p>`;
}

// ===== Admin: Clientes (detalhe, editar, foto, senha) =====
function abrirClientesAdmin(){
  $("#titulo").textContent="Clientes";
  let html="<table class='table'><tr><th>Cliente</th><th>Conta</th><th>Saldo</th><th></th></tr>";
  clientes.forEach((c,i)=>{
    html+=`<tr>
      <td><div class='media'><img class='avatar' src='${c.foto||""}' onerror="this.style.display='none'"/><div>${c.nome}<div style='opacity:.75;font-size:12px;'>${c.email}</div></div></div></td>
      <td>${c.conta}</td><td>${moeda(c.saldo)}</td>
      <td><span class='linklike' onclick='abrirClienteDetalhe(${i})'>Abrir</span></td>
    </tr>`;
  });
  html+="</table>";
  $("#conteudo").innerHTML=html;
}
function abrirClienteDetalhe(i){
  const c=clientes[i];
  $("#titulo").textContent=`Cliente — ${c.nome}`;
  let foto = c.foto ? `<img class='avatar' src='${c.foto}'/>` : `<div class='avatar' style='display:inline-block'></div>`;
  $("#conteudo").innerHTML=`
    <div class='row'>
      <div class='col'>
        <div class='media'>${foto}<div>
          <div class='label'>E-mail</div><div class='value'>${c.email}</div>
          <div class='label'>CPF</div><div class='value'>${c.cpf}</div>
          <div class='label'>Pix</div><div class='value'>${c.pix||'-'}</div>
          <div class='label'>Status</div><div class='value'>${c.status}</div>
        </div></div>
        <div style='margin-top:10px'>
          <input type="file" id="fileFoto" accept="image/*" style="display:none" onchange="uploadFoto(${i}, this)"/>
          <button class="btn small" onclick="document.getElementById('fileFoto').click()">Carregar/Alterar foto</button>
          <button class="btn small" onclick="resetarSenha(${i})">Gerar/Resetar senha</button>
        </div>
      </div>
      <div class='col'>
        <div class='label'>Banco</div><div class='value'>001</div>
        <div class='label'>Agência</div><div class='value'>${c.agencia}</div>
        <div class='label'>Conta</div><div class='value'>${c.conta}</div>
        <div class='label'>Saldo</div><div class='value'>${moeda(c.saldo)}</div>
        <button class='btn small' onclick='abrirEditarCliente(${i})'>Editar dados</button>
      </div>
    </div>
    <h3 style='margin-top:20px;'>Extrato do Cliente</h3>
    ${renderExtratoTabela(c.extrato)}
    <p><br><span class='linklike' onclick='abrirClientesAdmin()'>◀ Voltar à lista</span></p>
  `;
}
function uploadFoto(i, input){
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ clientes[i].foto = reader.result; alert("Foto atualizada."); abrirClienteDetalhe(i); };
  reader.readAsDataURL(file);
}
function resetarSenha(i){
  const nova=gerarSenha(8); clientes[i].senha = nova;
  alert(`Nova senha de ${clientes[i].nome}: ${nova} (simulado envio por e-mail).`);
}
function abrirEditarCliente(i){
  const c=clientes[i];
  $("#titulo").textContent=`Editar Cliente — ${c.nome}`;
  $("#conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarEdicaoCliente(${i});">
      <div><label>Nome</label><input id="edNome" value="${c.nome}" required /></div>
      <div><label>Email</label><input id="edEmail" type="email" value="${c.email}" required /></div>
      <div><label>Pix</label><input id="edPix" value="${c.pix||''}" /></div>
      <div><label>Status</label>
        <select id="edStatus">
          <option ${c.status==='ATIVA'?'selected':''}>ATIVA</option>
          <option ${c.status==='BLOQUEADA'?'selected':''}>BLOQUEADA</option>
        </select>
      </div>
      <button class="btn" type="submit">Salvar</button>
      <button class="btn ghost" type="button" onclick="abrirClienteDetalhe(${i})">Cancelar</button>
    </form>`;
}
function salvarEdicaoCliente(i){
  const c=clientes[i];
  c.nome=$("#edNome").value; c.email=$("#edEmail").value; c.pix=$("#edPix").value; c.status=$("#edStatus").value;
  alert("Dados atualizados."); abrirClienteDetalhe(i);
}

function renderExtratoTabela(movs){
  if(!movs || movs.length===0) return "<p>Sem movimentações.</p>";
  let html="<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>De</th><th>Para</th><th>Valor</th><th>Status</th></tr>";
  movs.slice().reverse().forEach(t=>{
    html+=`<tr>
      <td>${formatDate(new Date(t.data))}</td><td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td>
      <td>${moeda(t.valor)}</td><td><span class='badge'>${t.status}</span></td>
    </tr>`;
  });
  html+="</table>"; return html;
}

// ===== Admin: Novo cliente =====
function abrirCriarClienteAdmin(){
  $("#titulo").textContent="Criar Novo Cliente (Admin)";
  $("#conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); salvarNovoClienteAdmin();">
      <div><label>Nome</label><input id="novoNome" required /></div>
      <div><label>Email</label><input id="novoEmail" type="email" required /></div>
      <div><label>CPF</label><input id="novoCPF" required /></div>
      <div><label>Pix</label><input id="novoPix" /></div>
      <div><label>Saldo Inicial</label><input id="novoSaldo" type="number" value="1000" /></div>
      <button class="btn" type="submit">Salvar</button>
    </form>`;
}
function salvarNovoClienteAdmin(){
  const nome=$("#novoNome").value, email=$("#novoEmail").value, cpf=$("#novoCPF").value, pix=$("#novoPix").value;
  const saldo=parseFloat($("#novoSaldo").value||0);
  if(saldo>cofreAgencia){ alert("Cofre insuficiente para este saldo inicial."); return; }
  criarCliente(nome,email,cpf,pix,saldo,false,null);
  abrirClientesAdmin();
}

// ===== Admin: Transações =====
function abrirTransacoesAdmin(){
  $("#titulo").textContent="Histórico de Transações";
  if(transacoes.length===0){ $("#conteudo").innerHTML="<p>Sem transações até o momento.</p>"; return; }
  let html="<table class='table'><tr><th>Data/Hora</th><th>Tipo</th><th>De</th><th>Para</th><th>Valor</th><th>Status</th></tr>";
  transacoes.slice().reverse().forEach(t=>{
    html+=`<tr>
      <td>${formatDate(new Date(t.data))}</td><td>${t.tipo}</td><td>${t.de}</td><td>${t.para}</td>
      <td>${moeda(t.valor)}</td><td><span class='badge'>${t.status}</span></td>
    </tr>`;
  });
  html+="</table>"; $("#conteudo").innerHTML=html;
}

// ===== Cliente: dashboard =====
function abrirDashboardCliente(){
  $("#titulo").textContent="Infinity Fiber Digital — Cliente";
  const foto = usuarioLogado.foto ? `<img class='avatar' src='${usuarioLogado.foto}'/>` : `<div class='avatar'></div>`;
  $("#conteudo").innerHTML=`
    <div class='media' style='justify-content:center;'>${foto}<div>
      <div style='font-weight:700'>${usuarioLogado.nome}</div>
      <div style='opacity:.8;font-size:12px'>Banco 001 • Agência ${usuarioLogado.agencia} • Conta ${usuarioLogado.conta}</div>
    </div></div>
    <div style="text-align:center;margin-top:10px;">
      <h3>Saldo disponível</h3>
      <p style="font-size:28px; font-weight:bold;">${moeda(usuarioLogado.saldo)}</p>
    </div>
    <div class="card-grid">
      <div class="card" onclick="abrirTransferenciaCliente()"><div class="card-icon">💸</div><div>Transferir</div></div>
      <div class="card" onclick="abrirExtratoCliente()"><div class="card-icon">📜</div><div>Extrato</div></div>
      <div class="card" onclick="abrirPerfilCliente()"><div class="card-icon">👤</div><div>Meu Perfil</div></div>
    </div>`;
}

// ===== Cliente: perfil (ver/atualizar selfie) =====
async function abrirPerfilCliente(){
  $("#titulo").textContent="Meu Perfil";
  $("#conteudo").innerHTML=`
    <div class='row'>
      <div class='col'>
        <div class='label'>Nome</div><div class='value'>${usuarioLogado.nome}</div>
        <div class='label'>E-mail</div><div class='value'>${usuarioLogado.email}</div>
        <div class='label'>CPF</div><div class='value'>${usuarioLogado.cpf}</div>
        <div class='label'>Pix</div><div class='value'>${usuarioLogado.pix||'-'}</div>
      </div>
      <div class='col'>
        <div class='label'>Biometria (selfie)</div>
        <div id="selfieArea">${usuarioLogado.foto?`<img class='avatar' src='${usuarioLogado.foto}'/>`:'<div class="avatar"></div>'}</div>
        <div style="margin-top:8px">
          <button class="btn small" onclick="abrirCameraPerfil()">Atualizar selfie</button>
        </div>
      </div>
    </div>
    <p style="margin-top:10px;"><span class='linklike' onclick='abrirDashboardCliente()'>◀ Voltar</span></p>
  `;
}
let perfilStream=null;
async function abrirCameraPerfil(){
  $("#conteudo").insertAdjacentHTML('beforeend',`
    <div class="modal" id="modalSelfie">
      <div class="modal-card">
        <h3>Atualizar selfie</h3>
        <video id="videoPerfil" class="camera" autoplay playsinline></video>
        <canvas id="canvasPerfil" class="canvas"></canvas>
        <div class="modal-actions">
          <button class="btn ghost" onclick="fecharModalSelfie()">Cancelar</button>
          <button class="btn" onclick="capturarSelfiePerfil()">Capturar</button>
        </div>
      </div>
    </div>`);
  try{
    perfilStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    $("#videoPerfil").srcObject=perfilStream;
  }catch(e){ alert("Não foi possível acessar a câmera."); fecharModalSelfie(); }
}
function fecharModalSelfie(){
  if(perfilStream){ perfilStream.getTracks().forEach(t=>t.stop()); perfilStream=null; }
  const m=$("#modalSelfie"); if(m) m.remove();
}
function capturarSelfiePerfil(){
  const v=$("#videoPerfil"), c=$("#canvasPerfil");
  c.width=v.videoWidth||320; c.height=v.videoHeight||240;
  c.getContext("2d").drawImage(v,0,0,c.width,c.height);
  usuarioLogado.foto = c.toDataURL("image/png");
  fecharModalSelfie();
  abrirPerfilCliente();
}

// ===== Cliente: transferência com verificação facial (simulada) =====
function abrirTransferenciaCliente(){
  $("#titulo").textContent="Transferência";
  $("#conteudo").innerHTML=`
    <form class="form" onsubmit="event.preventDefault(); prepararVerificacaoFacial();">
      <div><label>Tipo</label>
        <select id="tipo">
          <option>PIX</option>
          <option>TED</option>
          <option>DOC</option>
        </select>
      </div>
      <div><label>Destinatário (email cadastrado)</label><input id="destEmail" required /></div>
      <div><label>Valor (R$)</label><input id="valor" type="number" required /></div>
      <div><label>Descrição (opcional)</label><textarea id="descricao"></textarea></div>
      <button class="btn" type="submit">Continuar</button>
      <p id="mensagem"></p>
    </form>`;
}
async function prepararVerificacaoFacial(){
  if(!usuarioLogado.foto){
    if(!confirm("Você não tem selfie cadastrada. Deseja cadastrar agora?")) return abrirPerfilCliente();
    return abrirPerfilCliente();
  }
  $("#conteudo").insertAdjacentHTML('beforeend',`
    <div class="modal" id="modalVerif">
      <div class="modal-card">
        <h3>Verificação facial</h3>
        <p style="opacity:.85">Posicione seu rosto e capture uma foto para confirmar a transferência.</p>
        <video id="videoV" class="camera" autoplay playsinline></video>
        <canvas id="canvasV" class="canvas"></canvas>
        <div class="modal-actions">
          <button class="btn ghost" onclick="fecharVerif()">Cancelar</button>
          <button class="btn" onclick="capturarVerif()">Capturar e Confirmar</button>
        </div>
      </div>
    </div>`);
  try{
    const s = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    $("#videoV").srcObject=s; $("#videoV").dataset.stream="on";
  }catch(e){ alert("Câmera não disponível. Operação não pode prosseguir."); fecharVerif(); }
}
function fecharVerif(){
  const v=$("#videoV");
  const stream = v && v.srcObject;
  if(stream){ stream.getTracks().forEach(t=>t.stop()); }
  const m=$("#modalVerif"); if(m) m.remove();
}
function capturarVerif(){
  const v=$("#videoV"), c=$("#canvasV");
  c.width=v.videoWidth||320; c.height=v.videoHeight||240;
  c.getContext("2d").drawImage(v,0,0,c.width,c.height);
  // Simulação: aprovado sempre
  fecharVerif();
  enviarTransferenciaComVerificacao();
}
function enviarTransferenciaComVerificacao(){
  const tipo=$("#tipo").value;
  const destEmail=$("#destEmail").value;
  const valor=parseFloat($("#valor").value||0);
  const descricao=$("#descricao").value;
  const msg=$("#mensagem");
  if(!(valor>0)){ msg.textContent="Informe um valor válido."; return; }
  if(usuarioLogado.saldo < valor){ msg.textContent="Saldo insuficiente."; return; }
  const destinatario=clientes.find(c=>c.email===destEmail);
  if(!destinatario){ msg.textContent="Destinatário não encontrado."; return; }
  if(destinatario.email===usuarioLogado.email){ msg.textContent="Não é possível transferir para si mesmo."; return; }
  const agora=new Date(); let status="concluída";
  if(tipo==="PIX"){
    usuarioLogado.saldo -= valor; destinatario.saldo += valor;
  } else {
    const hora=agora.getHours();
    const diaUtil = isBusinessDay(agora); 
    const permitido = diaUtil && ((tipo==="TED" && hora<17) || (tipo==="DOC" && hora<22));
    if(permitido){ usuarioLogado.saldo -= valor; destinatario.saldo += valor; }
    else { status = "agendada"; }
  }
  const registro={ data:agora.toISOString(), tipo, valor, de:usuarioLogado.email, para:destinatario.email, status, descricao };
  transacoes.push(registro);
  usuarioLogado.extrato.push({...registro});
  if(status==="concluída"){ destinatario.extrato.push({...registro}); }
  msg.textContent = status==="concluída" ? `✅ Reconhecimento facial verificado. ${tipo} de ${moeda(valor)} realizado.` : `✅ Reconhecimento facial verificado. ${tipo} agendado para o próximo dia útil.`;
}

// ===== Cliente: extrato =====
function abrirExtratoCliente(){
  $("#titulo").textContent="Extrato";
  $("#conteudo").innerHTML = renderExtratoTabela(usuarioLogado.extrato);
}

// ===== Inicialização =====
window.onload=function(){ inicializarClientes(); };
