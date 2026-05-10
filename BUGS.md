# Bug Documentation — Buggy Branch

This branch contains **6 intentional bugs** planted for QA testing practice.  
Use this document to verify your findings after testing.

---

## Bug Summary Table

| Bug ID  | Feature      | Description                                       | Severity | Priority |
|---------|-------------|---------------------------------------------------|----------|----------|
| BUG-001 | Login        | Any password is accepted — no validation          | Critical | High     |
| BUG-002 | Deposit      | Deposit credits double the entered amount         | High     | High     |
| BUG-003 | Deposit/Withdraw/Transfer | $0.00 transactions are allowed     | Medium   | Medium   |
| BUG-004 | Withdraw     | Negative balance allowed — no insufficient funds check | Critical | High |
| BUG-005 | Withdraw     | Withdrawals appear as "Deposit" in History        | Medium   | Medium   |
| BUG-006 | Transfer     | Money is deducted from the recipient instead of added | Critical | High |

---

## Detailed Bug Reports

---

### BUG-001 — Any Password Is Accepted

**Feature:** Login  
**Severity:** Critical | **Priority:** High

**Steps to Reproduce:**
1. Go to the Login page
2. Enter username: `alice`
3. Enter any wrong password (e.g., `wrongpass`, `abc123`, `hello`)
4. Click **Sign In**

**Expected Result:** Error message — *"Invalid username or password"*  
**Actual Result:** Login succeeds regardless of the password entered

**File:** `utils/bank.js` — `login()` function  
**Root Cause:** Password is not included in the user lookup — any string is accepted.

---

### BUG-002 — Deposit Credits Double the Amount

**Feature:** Deposit  
**Severity:** High | **Priority:** High

**Steps to Reproduce:**
1. Login as `alice` (starting balance: $5,000)
2. Go to **Deposit**
3. Enter `$100` and click **Deposit**
4. Check the balance on Dashboard

**Expected Result:** Balance increases to **$5,100**  
**Actual Result:** Balance increases to **$5,200** (double the amount)

**File:** `utils/bank.js` — `deposit()` function  
**Root Cause:** Balance is incremented by `amount * 2` instead of `amount`.

---

### BUG-003 — Zero Amount ($0.00) Is Accepted

**Feature:** Deposit, Withdraw, Transfer  
**Severity:** Medium | **Priority:** Medium

**Steps to Reproduce:**
1. Login and go to **Deposit** (or Withdraw or Transfer)
2. Enter `0` in the amount field
3. Click the action button

**Expected Result:** Error message — *"Amount must be greater than $0"*  
**Actual Result:** The transaction is processed successfully with $0

**File:** `utils/bank.js` — `deposit()`, `withdraw()`, `transfer()` functions  
**Root Cause:** Validation checks `num < 0` instead of `num <= 0`, so zero passes through.

---

### BUG-004 — Withdrawal Allows Negative Balance (No Funds Check)

**Feature:** Withdraw  
**Severity:** Critical | **Priority:** High

**Steps to Reproduce:**
1. Login as `alice` (balance: $5,000)
2. Go to **Withdraw**
3. Enter `$99,999` and click **Withdraw**

**Expected Result:** Error message — *"Insufficient funds"*  
**Actual Result:** Withdrawal succeeds; balance drops below $0

**File:** `utils/bank.js` — `withdraw()` function  
**Root Cause:** The insufficient funds check (`if balance < amount → error`) was removed entirely.

---

### BUG-005 — Withdrawals Show as "Deposit" in Transaction History

**Feature:** Transaction History  
**Severity:** Medium | **Priority:** Medium

**Steps to Reproduce:**
1. Login and make a withdrawal (e.g., withdraw $200)
2. Go to **History**
3. Look at the Type column for your withdrawal

**Expected Result:** Type badge shows **"Withdrawal"** (red badge)  
**Actual Result:** Type badge shows **"Deposit"** (green badge)

**File:** `utils/bank.js` — `withdraw()` function  
**Root Cause:** Transaction type is hardcoded as `'Deposit'` instead of `'Withdrawal'`.

---

### BUG-006 — Transfer Deducts Money from the Recipient

**Feature:** Transfer  
**Severity:** Critical | **Priority:** High

**Steps to Reproduce:**
1. Login as `alice` (balance: $5,000)
2. Go to **Transfer**, send $500 to `bob`
3. Note Alice's balance — it should decrease by $500
4. Logout, then login as `bob` (starting balance: $3,000)
5. Check Bob's balance

**Expected Result:** Bob's balance increases from $3,000 to **$3,500**  
**Actual Result:** Bob's balance decreases from $3,000 to **$2,500** — money stolen from recipient!

**File:** `utils/bank.js` — `transfer()` function  
**Root Cause:** Recipient balance uses `-=` (subtract) instead of `+=` (add).

---

## Testing Tips for Students

- **Test happy paths first** — make sure valid actions work before testing edge cases
- **Test boundary values** — try $0, negative numbers, very large numbers
- **Cross-account checking** — log in as one user, transact, then verify the other account
- **Check the History page** — does it reflect what actually happened?
- **Use "Reset All Data"** on the Dashboard to start fresh between test runs
