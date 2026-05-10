import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import {
  getCurrentUser, getTransactions, resetData,
  formatCurrency, formatDate,
} from '../utils/bank';

const TYPE_BADGE = {
  'Deposit':      'badge-deposit',
  'Withdrawal':   'badge-withdrawal',
  'Transfer In':  'badge-transfer-in',
  'Transfer Out': 'badge-transfer-out',
};

export default function DashboardPage() {
  const [user,   setUser]   = useState(null);
  const [recent, setRecent] = useState([]);

  const load = () => {
    const u = getCurrentUser();
    if (u) {
      setUser(u);
      setRecent(getTransactions().slice(0, 5));
    }
  };

  useEffect(() => { load(); }, []);

  const handleReset = () => {
    if (confirm('Reset all data? Balances will return to defaults and all transactions will be cleared.')) {
      resetData();
      load();
    }
  };

  if (!user) return null;

  return (
    <Layout>
      {/* Balance */}
      <div className="balance-card">
        <div className="bal-label">CURRENT BALANCE</div>
        <div className="bal-amount">{formatCurrency(user.balance)}</div>
        <div className="bal-account">Account: {user.username.toUpperCase()}001 · {user.name}</div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/deposit" className="action-btn">
          <span className="icon">⬇️</span>
          <span className="label">Deposit</span>
        </Link>
        <Link href="/withdraw" className="action-btn">
          <span className="icon">⬆️</span>
          <span className="label">Withdraw</span>
        </Link>
        <Link href="/transfer" className="action-btn">
          <span className="icon">↔️</span>
          <span className="label">Transfer</span>
        </Link>
        <Link href="/history" className="action-btn">
          <span className="icon">📋</span>
          <span className="label">History</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2>Recent Transactions</h2>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No transactions yet. Make a deposit to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => {
                  const isCredit = tx.type === 'Deposit' || tx.type === 'Transfer In';
                  return (
                    <tr key={tx.id}>
                      <td>{formatDate(tx.date)}</td>
                      <td>
                        <span className={`badge ${TYPE_BADGE[tx.type] || 'badge-deposit'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={isCredit ? 'amount-positive' : 'amount-negative'}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td>{formatCurrency(tx.balanceAfter)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {recent.length > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Link href="/history" style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none' }}>
              View all transactions →
            </Link>
          </div>
        )}
      </div>

      {/* Reset */}
      <div style={{ textAlign: 'right' }}>
        <button className="btn-danger" onClick={handleReset}>
          🔄 Reset All Data
        </button>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
          Resets balances and clears all transactions (useful for retesting)
        </p>
      </div>
    </Layout>
  );
}
