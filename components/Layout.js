import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout, initData } from '../utils/bank';

const TABS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/deposit',   label: 'Deposit'   },
  { href: '/withdraw',  label: 'Withdraw'  },
  { href: '/transfer',  label: 'Transfer'  },
  { href: '/history',   label: 'History'   },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    initData();
    const u = getCurrentUser();
    if (!u) {
      router.push('/');
    } else {
      setUser(u);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">🏦 SecureBank</div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="nav-tabs">
        {TABS.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-tab ${router.pathname === tab.href ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
}
