import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getTransactions, formatCurrency, formatDate } from '../utils/bank';

const TYPE_BADGE = {
  'Deposit':      'badge-deposit',
  'Withdrawal':   'badge-withdrawal',
  'Transfer In':  'badge-transfer-in',
  'Transfer Out': 'badge-transfer-out',
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loaded,       setLoaded]       = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <Layout>
      <p className="page-title">Transaction History</p>

      <div className="card">
        <h2>All Transactions ({transactions.length})</h2>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No transactions yet. Go ahead and make your first deposit!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const isCredit = tx.type === 'Deposit' || tx.type === 'Transfer In';
                  return (
                    <tr key={tx.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                      <td>
                        <span className={`badge ${TYPE_BADGE[tx.type] || 'badge-deposit'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>{tx.note || '—'}</td>
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
      </div>
    </Layout>
  );
}
