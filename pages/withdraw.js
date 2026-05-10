import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, withdraw, formatCurrency } from '../utils/bank';

export default function WithdrawPage() {
  const [user,    setUser]    = useState(null);
  const [amount,  setAmount]  = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => { setUser(getCurrentUser()); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    const result = withdraw(amount);
    if (result.success) {
      setMessage({ type: 'success', text: `Withdrawal successful! New balance: ${formatCurrency(result.balance)}` });
      setAmount('');
      setUser(getCurrentUser());
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <p className="page-title">Withdraw Funds</p>

      <div className="card" style={{ maxWidth: 480 }}>
        <h2>Make a Withdrawal</h2>

        <div style={{ marginBottom: 24, padding: '14px 18px', background: '#f8fafc', borderRadius: 8, fontSize: 14 }}>
          Available Balance: <strong style={{ color: '#1e3a5f', fontSize: 18 }}>{formatCurrency(user.balance)}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (USD)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            <p className="form-hint">You cannot withdraw more than your available balance.</p>
          </div>

          {message && (
            <div className={message.type === 'success' ? 'msg-success' : 'msg-error'}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary">Withdraw</button>
        </form>
      </div>
    </Layout>
  );
}
