import { useState } from "react";
import { COFRE_BALANCE } from "../config/initialBalances";
import { formatBRL } from "../utils/format";

export default function CofreButton() {
  const [liberado, setLiberado] = useState(false);

  async function handleCofreAccess(validAdmin = false) {
    // Mock da biometria
    if (validAdmin) {
      setLiberado(true);
      alert("✅ Você é o Administrador. Acesso ao Cofre liberado.");
    } else {
      setLiberado(false);
      alert("❌ Reconhecimento não compatível. Acesso bloqueado.");
    }
  }

  return (
    <div className="card" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
      <h3>Cofre Bancário</h3>
      {!liberado ? (
        <div>
          <button onClick={() => handleCofreAccess(false)} style={{ marginRight: "10px" }}>
            Testar acesso com minha foto (falha)
          </button>
          <button onClick={() => handleCofreAccess(true)}>
            Testar acesso com foto do Administrador (sucesso)
          </button>
        </div>
      ) : (
        <div>
          <p><b>Saldo do Cofre:</b> {formatBRL(COFRE_BALANCE)}</p>
          <p>🔒 Funções internas do Cofre disponíveis…</p>
        </div>
      )}
    </div>
  );
}
