import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const tryLogin = () => {
    if (user === "DanielKascher" && pass === "K@scher123") {
      onLogin("cliente");
    } else if (user === "admin" && pass === "admin") {
      onLogin("admin");
    } else {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-6 w-80">
        <h1 className="text-xl font-bold mb-4">Infinity Fiber App</h1>
        <input
          placeholder="Usuário"
          className="border w-full mb-2 p-2 rounded"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          className="border w-full mb-4 p-2 rounded"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button
          onClick={tryLogin}
          className="w-full bg-black text-white py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

function DashboardCliente({ onBack }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Dashboard do Cliente</h2>
      <p>Saldo: R$ 12.850,39</p>
      <p>Investimentos: R$ 11.000,00</p>
      <p>Limite: R$ 5.000,00</p>
      <button onClick={onBack} className="mt-4 px-3 py-2 border rounded">
        Sair
      </button>
    </div>
  );
}

function AdminPanel({ onBack }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Módulo Administrador</h2>
      <p>Saldo Banco: R$ 37,3 bilhões</p>
      <button onClick={onBack} className="mt-4 px-3 py-2 border rounded">
        Sair
      </button>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState("login");

  return (
    <div className="font-sans">
      {route === "login" && <LoginForm onLogin={setRoute} />}
      {route === "cliente" && <DashboardCliente onBack={() => setRoute("login")} />}
      {route === "admin" && <AdminPanel onBack={() => setRoute("login")} />}
    </div>
  );
}
