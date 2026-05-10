# SecureBank — QA Practice Banking App

A simple full-stack banking application built for QA training. Students test the live app, find bugs, and write bug reports — just like real-world QA work.

---

## Live Deployments

| Version | URL | Purpose |
|---------|-----|---------|
| **Working App** | https://securebank-working.vercel.app | Reference / answer key |
| **Buggy App** | https://securebank-buggy.vercel.app | Student testing target |

Give students the **Buggy App** URL for the practical exam. Share the Working App URL after the session so they can compare behaviour.

---

## Demo Accounts

| Username | Password | Starting Balance |
|----------|----------|-----------------|
| `alice` | `1234` | $5,000 |
| `bob` | `1234` | $3,000 |

> Both accounts work on both deployments. Use the **Reset All Data** button on the Dashboard to restore balances and clear transaction history between test runs.

---

## Features to Test

- **Login / Logout** — username + password authentication
- **Deposit** — add funds to your account
- **Withdraw** — remove funds (should block if balance is insufficient)
- **Transfer** — send money to another account
- **Transaction History** — view all past transactions with correct types and amounts

---

## Buggy App — 6 Intentional Bugs

The `buggy` branch / Buggy App URL contains these bugs for students to find:

| Bug ID | Feature | What's Wrong | Severity |
|--------|---------|--------------|----------|
| BUG-001 | Login | Any password is accepted — no validation | Critical |
| BUG-002 | Deposit | Credits double the entered amount | High |
| BUG-003 | All Forms | $0.00 transactions are allowed | Medium |
| BUG-004 | Withdraw | Allows negative balance — no insufficient funds check | Critical |
| BUG-005 | History | Withdrawals show as "Deposit" in the type column | Medium |
| BUG-006 | Transfer | Money is deducted from the recipient instead of added | Critical |

Full reproduction steps for each bug are in [BUGS.md](./BUGS.md).

---

## GitHub Repository

**Repo:** https://github.com/israelIsiaka/securebank-app

| Branch | Description |
|--------|-------------|
| `main` | Fully working application |
| `buggy` | App with 6 intentional bugs |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/israelIsiaka/securebank-app.git
cd securebank-app

# Install dependencies
npm install

# Run the working version
git checkout main
npm run dev

# Run the buggy version
git checkout buggy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Data is stored in `localStorage` — it resets when you clear browser storage or click **Reset All Data** on the Dashboard.

---

## Tech Stack

- **Framework:** Next.js 14 (React, pages router)
- **Styling:** Plain CSS
- **Data storage:** Browser localStorage (no backend/database needed)
- **Deployment:** Vercel
