import BankCard from "../components/BankCard";
import CofreButton from "../components/CofreButton";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Painel Principal</h2>
      <BankCard />
      <CofreButton />
      <TransactionList />
    </div>
  );
}
