import React, { useEffect, useRef, useState } from "react";

// Utilitário de formatação BRL
const brl = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

// Topbar
const TopBar = ({ title, onBack, right }) => (
  <div className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50 active:scale-[.98] transition"
          >
            Voltar
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  </div>
);

// Card
const Card = ({ title, children, footer, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white min-h-[110px]"
  >
    <div className="text-xs text-gray-500 mb-2 font-medium">{title}</div>
    <div className="text-sm">{children}</div>
    {footer && <div className="mt-3 text-[11px] text-gray-500">{footer}</div>}
  </div>
);

// Modal de Câmera / Biometria
const CameraModal = ({ open, title, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream;
    const start = async () => {
      if (!open) return;
      setError("");
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError("Não foi possível acessar a câmera. Verifique permissões do navegador.");
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [open]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCapture?.(dataUrl);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
        {error && (
          <div className="text-xs text-red-600 mb-2 bg-red-50 border border-red-100 rounded-lg p-2">
            {error}
          </div>
        )}
        <div className="rounded-xl overflow-hidden bg-black aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="mt-3 flex gap-2 justify-end">
          <button
            onClick={handleCapture}
            className="px-3 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 active:scale-[.98]"
          >
            Capturar & Salvar
          </button>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          Demonstração: captura salva localmente para validar ações protegidas. Não há reconhecimento facial real.
        </p>
      </div>
    </div>
  );
};

// Login
const LoginForm = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const tryLogin = () => {
    if (user === "DanielKascher" && pass === "K@scher123") {
      onLogin({ role: "cliente", name: "Daniel Kascher" });
      return;
    }
    if (user === "admin" && pass === "admin") {
      onLogin({ role: "admin", name: "Administrador" });
      return;
    }
    setErr("Credenciais inválidas. Tente novamente.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <h1 className="text-xl font-semibold mb-1">Infinity Fiber App</h1>
        <p className="text-sm text-gray-500 mb-4">Acesse sua conta</p>
        {err && (
          <div className="text-xs text-red-600 mb-3 bg-red-50 border border-red-100 rounded-lg p-2">
            {err}
          </div>
        )}
        <label className="text-xs text-gray-600">Usuário</label>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full mt-1 mb-3 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder="DanielKascher ou admin"
        />
        <label className="text-xs text-gray-600">Senha</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          className="w-full mt-1 mb-4 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder="K@scher123 ou admin"
        />
        <button
          onClick={tryLogin}
          className="w-full rounded-xl bg-black text-white py-2 text-sm font-medium hover:opacity-90 active:scale-[.99]"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

// Dashboard Cliente
const DashboardCliente = ({ onBackToLogin }) => {
  const [showCofre, setShowCofre] = useState(false);
  const [needBio, setNeedBio] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [bioSaved, setBioSaved] = useState(!!localStorage.getItem("biometria_cliente"));

  const saldoAtual = 12850.39;
  const limite = 5000;
  const investimentos = [
    { id: 1, nome: "CDB Liquidez Diária", valor: 3200.0, rendimento: 0.98 },
    { id: 2, nome: "LCI 12m", valor: 7800.0, rendimento: 1.02 },
  ];
  const recebimentosFuturos = [
    { id: 1, data: "2025-10-05", descricao: "Recebível Cartão - Lote #9182", valor: 2150.0 },
    { id: 2, data: "2025-10-17", descricao: "Boleto - Cliente XPTO", valor: 1320.5 },
    { id: 3, data: "2025-11-03", descricao: "Pix Agendado - Serviço", valor: 680.75 },
  ];

  const abrirCofre = () => {
    if (!bioSaved) {
      setNeedBio(true);
      setCameraOpen(true);
      return;
    }
    setShowCofre(true);
  };

  const handleCapture = (dataUrl) => {
    localStorage.setItem("biometria_cliente", dataUrl);
    setBioSaved(true);
    setCameraOpen(false);
    setNeedBio(false);
    setShowCofre(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Dashboard do Cliente"
        onBack={onBackToLogin}
        right={
          <img
            src={bioSaved ? localStorage.getItem("biometria_cliente") : undefined}
            alt="avatar"
            className="w-8 h-8 rounded-full border object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        }
      />

      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card title="Saldo Atual">
          <div className="text-2xl font-semibold">{brl(saldoAtual)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Atualizado agora</div>
        </Card>

        <Card title="Investimentos" footer="Toque para ver detalhes" onClick={() => alert("Tela de investimentos (demo)")}>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {investimentos.map((i) => (
              <li key={i.id}>
                {i.nome}: <span className="font-medium">{brl(i.valor)}</span>
                <span className="text-gray-500"> · CDI {i.rendimento}x</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Limite de Crédito" footer="Disponível para uso">
          <div className="text-2xl font-semibold">{brl(limite)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Aprovado acima de R$ 3.000</div>
        </Card>

        <div className="sm:col-span-2 lg:col-span-2">
          <Card title="Recebimentos Futuros" onClick={() => alert("Tela de recebimentos futuros (demo)")} >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="py-2">Data</th>
                    <th>Descrição</th>
                    <th className="text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {recebimentosFuturos.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2">{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                      <td>{r.descricao}</td>
                      <td className="text-right font-medium">{brl(r.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card
          title="Cofre Bancário (Biometria)"
          onClick={abrirCofre}
          footer={bioSaved ? "Biometria cadastrada: toque para abrir" : "Toque para cadastrar a biometria e abrir"}
        >
          <p className="text-sm leading-relaxed">
            Acesso protegido: é necessário validar a biometria facial para abrir e movimentar valores do cofre.
          </p>
          {showCofre && (
            <div className="mt-3 p-3 border rounded-xl bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">Cofre aberto</div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-xl bg-black text-white text-sm">Transferir</button>
                <button className="px-3 py-2 rounded-xl border text-sm">Depositar</button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <CameraModal
        open={cameraOpen}
        title={needBio ? "Capturar biometria do cliente" : "Capturar foto"}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
};

// Admin
const AdminPanel = ({ onBack }) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [bioSaved, setBioSaved] = useState(!!localStorage.getItem("biometria_admin"));
  const [saldoBanco, setSaldoBanco] = useState(37300000000); // 37,3 bi

  const [solicitacoes, setSolicitacoes] = useState([
    { id: 1, cliente: "Daniel Kascher", tipo: "Saque Cofre", valor: 1500.0 },
    { id: 2, cliente: "Empresa XPTO", tipo: "Transferência", valor: 9800.0 },
  ]);

  const aprovar = (id) => {
    if (!bioSaved) {
      setCameraOpen(true);
      return;
    }
    const req = solicitacoes.find((s) => s.id === id);
    if (req) {
      setSaldoBanco((s) => s - req.valor);
      setSolicitacoes((arr) => arr.filter((s) => s.id !== id));
      alert(`Operação aprovada para ${req.cliente}: ${brl(req.valor)}`);
    }
  };

  const recusar = (id) => {
    setSolicitacoes((arr) => arr.filter((s) => s.id !== id));
    alert("Operação recusada.");
  };

  const handleCapture = (dataUrl) => {
    localStorage.setItem("biometria_admin", dataUrl);
    setBioSaved(true);
    setCameraOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Módulo do Administrador"
        onBack={onBack}
        right={
          <img
            src={bioSaved ? localStorage.getItem("biometria_admin") : undefined}
            alt="avatar"
            className="w-8 h-8 rounded-full border object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        }
      />

      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card title="Saldo do Banco">
          <div className="text-2xl font-semibold">{brl(saldoBanco)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Inicial: R$ 37,3 bilhões</div>
        </Card>

        <Card
          title="Biometria do Administrador"
          onClick={() => setCameraOpen(true)}
          footer={bioSaved ? "Biometria cadastrada" : "Cadastrar biometria"}
        >
          <p className="text-sm">Obrigatória para aprovar operações sensíveis.</p>
        </Card>

        <div className="sm:col-span-2 lg:col-span-3">
          <Card title="Solicitações Pendentes">
            {solicitacoes.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma solicitação no momento.</p>
            ) : (
              <div className="space-y-2">
                {solicitacoes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium">{s.tipo}</div>
                      <div className="text-xs text-gray-500">
                        Cliente: {s.cliente} · Valor: <span className="font-medium">{brl(s.valor)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => aprovar(s.id)} className="px-3 py-2 rounded-xl bg-black text-white text-sm">
                        Aprovar
                      </button>
                      <button onClick={() => recusar(s.id)} className="px-3 py-2 rounded-xl border text-sm">
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <CameraModal
        open={cameraOpen}
        title="Capturar biometria do administrador"
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
};

// App root
export default function App() {
  const [route, setRoute] = useState("login"); // login | cliente | admin
  const handleLogin = (user) => setRoute(user.role === "admin" ? "admin" : "cliente");
  const goLogin = () => setRoute("login");

  return (
    <div className="font-sans">
      {route === "login" && <LoginForm onLogin={handleLogin} />}
      {route === "cliente" && <DashboardCliente onBackToLogin={goLogin} />}
      {route === "admin" && <AdminPanel onBack={goLogin} />}
    </div>
  );
}
