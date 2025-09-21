import { useState, useEffect } from "react";
import FacialAuthButton from "./FacialAuthButton";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  // Carregar transações PENDING do backend
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("http://localhost:3000/transactions/pending");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Erro ao carregar transações:", err);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="card" style={{ padding: "20px", marginTop: "20px" }}>
      <h3>Transações Pendentes</h3>
      {transactions.length === 0 ? (
        <p>Nenhuma transação pendente.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Descrição</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Valor (R$)</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderTop: "1px solid #ccc" }}>
                <td style={{ padding: "8px" }}>{tx.id}</td>
                <td style={{ padding: "8px" }}>{tx.description}</td>
                <td style={{ padding: "8px" }}>{tx.amount}</td>
                <td style={{ padding: "8px" }}>
                  <FacialAuthButton transactionId={tx.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
