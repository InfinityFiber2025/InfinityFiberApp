
const LS_KEY='if_bank_v1';const fmtBRL=n=>(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});const now=()=>new Date();const fmtDT=d=>new Date(d).toLocaleString('pt-BR');
function defState(){return{usuario:{login:'DanielKascher',nome:'Daniel Kascher'},conta:{banco:'Infinity Fiber',agencia:'0001',numero:'123456-7'},config:{ocultarSaldo:false},saldo:5000000000,extrato:[{dt:now(),tipo:'Crédito',desc:'Saldo inicial (ambiente de testes)',valor:5000000000}],notificacoes:[{dt:now(),text:'Conta aprovada com reconhecimento facial'},{dt:now(),text:'Bem-vindo ao Banco Digital Infinity Fiber'}],cartao:null,clientes:[]};}
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||defState();}catch(e){return defState();}}function save(){localStorage.setItem(LS_KEY,JSON.stringify(S));}
let S=load();function go(h){window.location.href=h;}function ensureAuth(){if(sessionStorage.getItem('logado')!=='1'){window.location.href='index.html';}}
function pushMov(tipo,desc,valor){S.extrato.unshift({dt:now(),tipo,desc,valor});S.saldo=(S.saldo||0)+(valor||0);save();}
function notify(text){S.notificacoes.unshift({dt:now(),text});save();}
const BANKS=['Banco do Brasil','Itaú','Bradesco','Caixa Econômica Federal','Santander','Nubank','BTG Pactual','C6 Bank','Inter','Mercado Pago'];
