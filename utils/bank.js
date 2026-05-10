const STORAGE_KEY = 'securebank_data';

const DEFAULT_DATA = {
  users: [
    { id: 1, name: 'Alice Johnson', username: 'alice', password: '1234', balance: 5000 },
    { id: 2, name: 'Bob Smith',     username: 'bob',   password: '1234', balance: 3000 },
  ],
  transactions: [],
  currentUserId: null,
};

export function initData() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  }
}

export function getData() {
  if (typeof window === 'undefined') return { ...DEFAULT_DATA };
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { ...DEFAULT_DATA };
}

function saveData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function login(username, password) {
  const data = getData();
  const user = data.users.find(u => u.username === username);
  if (!user) return { success: false, error: 'Invalid username or password' };
  data.currentUserId = user.id;
  saveData(data);
  return { success: true, user };
}

export function logout() {
  const data = getData();
  data.currentUserId = null;
  saveData(data);
}

export function getCurrentUser() {
  const data = getData();
  if (!data.currentUserId) return null;
  return data.users.find(u => u.id === data.currentUserId) || null;
}

export function getOtherUsers() {
  const data = getData();
  return data.users.filter(u => u.id !== data.currentUserId);
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function deposit(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return { success: false, error: 'Amount must be greater than $0' };

  const data = getData();
  const idx = data.users.findIndex(u => u.id === data.currentUserId);
  if (idx === -1) return { success: false, error: 'Not logged in' };

  data.users[idx].balance += num * 2;
  data.transactions.unshift({
    id: Date.now(),
    userId: data.currentUserId,
    type: 'Deposit',
    amount: num,
    note: '',
    date: new Date().toISOString(),
    balanceAfter: data.users[idx].balance,
  });
  saveData(data);
  return { success: true, balance: data.users[idx].balance };
}

export function withdraw(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return { success: false, error: 'Amount must be greater than $0' };

  const data = getData();
  const idx = data.users.findIndex(u => u.id === data.currentUserId);
  if (idx === -1) return { success: false, error: 'Not logged in' };

  data.users[idx].balance -= num;
  data.transactions.unshift({
    id: Date.now(),
    userId: data.currentUserId,
    type: 'Deposit',
    amount: num,
    note: '',
    date: new Date().toISOString(),
    balanceAfter: data.users[idx].balance,
  });
  saveData(data);
  return { success: true, balance: data.users[idx].balance };
}

export function transfer(toUsername, amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return { success: false, error: 'Amount must be greater than $0' };

  const data = getData();
  const sIdx = data.users.findIndex(u => u.id === data.currentUserId);
  if (sIdx === -1) return { success: false, error: 'Not logged in' };

  const rIdx = data.users.findIndex(u => u.username === toUsername);
  if (rIdx === -1) return { success: false, error: 'Recipient account not found' };
  if (data.users[sIdx].username === toUsername) return { success: false, error: 'Cannot transfer to your own account' };
  if (data.users[sIdx].balance < num) return { success: false, error: 'Insufficient funds' };

  data.users[sIdx].balance -= num;
  data.users[rIdx].balance  -= num;

  const now          = new Date().toISOString();
  const senderName   = data.users[sIdx].name;
  const receiverName = data.users[rIdx].name;

  data.transactions.unshift({
    id: Date.now(),
    userId: data.currentUserId,
    type: 'Transfer Out',
    amount: num,
    note: `To: ${receiverName}`,
    date: now,
    balanceAfter: data.users[sIdx].balance,
  });
  data.transactions.unshift({
    id: Date.now() + 1,
    userId: data.users[rIdx].id,
    type: 'Transfer In',
    amount: num,
    note: `From: ${senderName}`,
    date: now,
    balanceAfter: data.users[rIdx].balance,
  });

  saveData(data);
  return { success: true, balance: data.users[sIdx].balance };
}

export function getTransactions() {
  const data = getData();
  return data.transactions.filter(t => t.userId === data.currentUserId);
}

export function resetData() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
