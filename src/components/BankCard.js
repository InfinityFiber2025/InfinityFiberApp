import { INITIAL_BANK_BALANCE } from '../config/initialBalances';
import { formatBRL } from '../utils/format';

export default function BankCard() {
  return (
    <div className="card">
      <h3>Saldo do Banco Principal</h3>
      <p>{formatBRL(INITIAL_BANK_BALANCE)}</p>
    </div>
  );
}
