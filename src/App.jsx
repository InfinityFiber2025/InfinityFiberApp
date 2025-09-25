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
    <div style={{ padding: 20 }}>
      <h1>Infinity Fiber App</h1>
      <input placeholder="Usuário" value={user} onChange={e => setUser(e.target.value)} /><br />
      <input placeholder="Senha" type="password" value={pass} onChange={e => setPass(e.target.value)} /><br />
      <button onClick={tryLogin}>Entrar</button>
    </div>
  );
}

function DashboardCliente() {
  return <h2>Dashboard do Cliente (demo simplificado)</h2>;
}

function AdminPanel() {
  return <h2>Módulo Administrador (demo simplificado)</h2>;
}

export default function App() {
  const [route, setRoute] = useState("login");

  return (
    <div>
      {route === "login" && <LoginForm onLogin={setRoute} />}
      {route === "cliente" && <DashboardCliente />}
      {route === "admin" && <AdminPanel />}
    </div>
  );
}
