import { useState } from "react";

export default function FacialAuthButton({ transactionId }) {
  const [result, setResult] = useState(null);

  async function handleFacialAuth(validAdmin = false) {
    try {
      // Simulação: se validAdmin = true => "admin_ok", caso contrário "admin_fail"
      const image = validAdmin ? "admin_ok" : "admin_fail";

      const response = await fetch(
        `http://localhost:3000/transactions/${transactionId}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: err.message });
    }
  }

  return (
    <div className="card" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Teste de Biometria Facial</h3>
      <button onClick={() => handleFacialAuth(false)} style={{ marginRight: "10px" }}>
        Testar com minha foto (falha)
      </button>
      <button onClick={() => handleFacialAuth(true)}>
        Testar com foto do Administrador (sucesso)
      </button>

      {result && (
        <div style={{ marginTop: "10px" }}>
          {result.success ? (
            <p style={{ color: "green" }}>{result.message}</p>
          ) : (
            <p style={{ color: "red" }}>{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
