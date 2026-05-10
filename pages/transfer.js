import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, getOtherUsers, transfer, formatCurrency } from '../utils/bank';

export default function TransferPage() {
  const [user,       setUser]       = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [to,         setTo]         = useState('');
  const [amount,     setAmount]     = useState('');
  const [message,    setMessage]    = useState(null);

  useEffect(() => {
    const u = getCurrentUser();
    const others = getOtherUsers();
    setUser(u);
    setRecipients(others);
    if (others.length > 0) setTo(others[0].username);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    const result = transfer(to, amount);
    if (result.success) {
      setMessage({ type: 'success', text: `Transfer successful! New balance: ${formatCurrency(result.balance)}` });
      setAmount('');
      setUser(getCurrentUser());
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <p className="page-title">Transfer Funds</p>

      <div className="card" style={{ maxWidth: 480 }}>
        <h2>Send Money</h2>

        <div style={{ marginBottom: 24, padding: '14px 18px', background: '#f8fafc', borderRadius: 8, fontSize: 14 }}>
          Available Balance: <strong style={{ color: '#1e3a5f', fontSize: 18 }}>{formatCurrency(user.balance)}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipient">Send To</label>
            <select
              id="recipient"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
            >
              {recipients.map(r => (
                <option key={r.id} value={r.username}>
                  {r.name} (@{r.username})
                </option>
              ))}
            </select>
          </div>

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
            <p className="form-hint">Funds will be transferred immediately.</p>
          </div>

          {message && (
            <div className={message.type === 'success' ? 'msg-success' : 'msg-error'}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary">Transfer</button>
        </form>
      </div>
    </Layout>
  );
}
