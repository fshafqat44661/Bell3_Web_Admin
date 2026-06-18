const STORAGE_KEY = "bell3_finance_data";
const COINS_PER_DOLLAR = 10;

const seedData = () => ({
  coinPackages: [
    {
      id: 1,
      name: "Starter Pack",
      coins: 100,
      price_usd: 10,
      bonus_coins: 0,
      stripe_price_id: "price_starter",
      is_active: true,
      created_at: "2025-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Creator Pack",
      coins: 500,
      price_usd: 45,
      bonus_coins: 50,
      stripe_price_id: "price_creator",
      is_active: true,
      created_at: "2025-01-15T10:00:00Z",
    },
    {
      id: 3,
      name: "Pro Pack",
      coins: 1000,
      price_usd: 85,
      bonus_coins: 150,
      stripe_price_id: "price_pro",
      is_active: true,
      created_at: "2025-01-15T10:00:00Z",
    },
    {
      id: 4,
      name: "Legacy Pack",
      coins: 250,
      price_usd: 25,
      bonus_coins: 0,
      stripe_price_id: "price_legacy",
      is_active: false,
      created_at: "2024-11-01T10:00:00Z",
    },
  ],
  transactions: [
    {
      id: 1,
      type: "purchase",
      user_id: 101,
      user_name: "Sarah Mitchell",
      user_email: "sarah@bell3.net",
      coins: 500,
      amount_usd: 45,
      status: "completed",
      stripe_payment_id: "pi_3QxStarter001",
      reference: "PKG-2",
      created_at: "2025-06-10T14:22:00Z",
    },
    {
      id: 2,
      type: "gift",
      user_id: 102,
      user_name: "James Cooper",
      user_email: "james@bell3.net",
      coins: 50,
      amount_usd: 0,
      status: "completed",
      stripe_payment_id: null,
      reference: "GIFT-001",
      recipient_name: "Emma Wilson",
      created_at: "2025-06-11T09:15:00Z",
    },
    {
      id: 3,
      type: "withdrawal",
      user_id: 103,
      user_name: "Luna Rivera",
      user_email: "luna@bell3.net",
      coins: 200,
      amount_usd: 20,
      status: "pending",
      stripe_payment_id: null,
      reference: "WD-003",
      created_at: "2025-06-12T16:40:00Z",
    },
    {
      id: 4,
      type: "purchase",
      user_id: 104,
      user_name: "Marcus Chen",
      user_email: "marcus@bell3.net",
      coins: 100,
      amount_usd: 10,
      status: "completed",
      stripe_payment_id: "pi_3QxStarter002",
      reference: "PKG-1",
      created_at: "2025-06-13T11:05:00Z",
    },
    {
      id: 5,
      type: "withdrawal",
      user_id: 105,
      user_name: "Aisha Khan",
      user_email: "aisha@bell3.net",
      coins: 350,
      amount_usd: 35,
      status: "approved",
      stripe_payment_id: null,
      reference: "WD-005",
      created_at: "2025-06-08T08:30:00Z",
    },
  ],
  withdrawals: [
    {
      id: 1,
      user_id: 103,
      user_name: "Luna Rivera",
      user_email: "luna@bell3.net",
      coins: 200,
      amount_usd: 20,
      status: "pending",
      admin_remarks: null,
      payment_method: "PayPal",
      payment_details: "luna.rivera@email.com",
      created_at: "2025-06-12T16:40:00Z",
      processed_at: null,
    },
    {
      id: 2,
      user_id: 106,
      user_name: "Tyler Brooks",
      user_email: "tyler@bell3.net",
      coins: 150,
      amount_usd: 15,
      status: "pending",
      admin_remarks: null,
      payment_method: "Bank Transfer",
      payment_details: "****4521",
      created_at: "2025-06-14T10:20:00Z",
      processed_at: null,
    },
    {
      id: 3,
      user_id: 105,
      user_name: "Aisha Khan",
      user_email: "aisha@bell3.net",
      coins: 350,
      amount_usd: 35,
      status: "approved",
      admin_remarks: "Verified identity. Processed via Stripe payout.",
      payment_method: "Stripe",
      payment_details: "acct_1NxK2",
      created_at: "2025-06-08T08:30:00Z",
      processed_at: "2025-06-09T14:00:00Z",
    },
    {
      id: 4,
      user_id: 107,
      user_name: "Nina Patel",
      user_email: "nina@bell3.net",
      coins: 80,
      amount_usd: 8,
      status: "rejected",
      admin_remarks: "Insufficient account verification.",
      payment_method: "PayPal",
      payment_details: "nina.p@email.com",
      created_at: "2025-06-05T12:00:00Z",
      processed_at: "2025-06-06T09:00:00Z",
    },
  ],
  creators: [
    {
      id: 201,
      name: "Luna Rivera",
      email: "luna@bell3.net",
      total_earnings_usd: 1240,
      pending_withdrawal_usd: 20,
      wallet_balance_coins: 450,
      total_gifts_received: 89,
      is_suspended: false,
      suspension_reason: null,
      joined_at: "2024-03-12T00:00:00Z",
    },
    {
      id: 202,
      name: "Marcus Chen",
      email: "marcus@bell3.net",
      total_earnings_usd: 890,
      pending_withdrawal_usd: 0,
      wallet_balance_coins: 320,
      total_gifts_received: 56,
      is_suspended: false,
      suspension_reason: null,
      joined_at: "2024-05-20T00:00:00Z",
    },
    {
      id: 203,
      name: "Aisha Khan",
      email: "aisha@bell3.net",
      total_earnings_usd: 2100,
      pending_withdrawal_usd: 0,
      wallet_balance_coins: 180,
      total_gifts_received: 142,
      is_suspended: false,
      suspension_reason: null,
      joined_at: "2023-11-08T00:00:00Z",
    },
    {
      id: 204,
      name: "Tyler Brooks",
      email: "tyler@bell3.net",
      total_earnings_usd: 340,
      pending_withdrawal_usd: 15,
      wallet_balance_coins: 90,
      total_gifts_received: 23,
      is_suspended: true,
      suspension_reason: "Policy violation — flagged content",
      joined_at: "2024-08-01T00:00:00Z",
    },
  ],
  userWallets: [
    {
      id: 101,
      name: "Sarah Mitchell",
      email: "sarah@bell3.net",
      role: "user",
      balance_coins: 380,
      lifetime_purchased_coins: 600,
      lifetime_spent_coins: 220,
      lifetime_withdrawn_coins: 0,
      is_active: true,
      last_transaction_at: "2025-06-10T14:22:00Z",
    },
    {
      id: 102,
      name: "James Cooper",
      email: "james@bell3.net",
      role: "user",
      balance_coins: 120,
      lifetime_purchased_coins: 200,
      lifetime_spent_coins: 130,
      lifetime_withdrawn_coins: 0,
      is_active: true,
      last_transaction_at: "2025-06-11T09:15:00Z",
    },
    {
      id: 103,
      name: "Luna Rivera",
      email: "luna@bell3.net",
      role: "creator",
      balance_coins: 450,
      lifetime_purchased_coins: 800,
      lifetime_spent_coins: 150,
      lifetime_withdrawn_coins: 550,
      is_active: true,
      last_transaction_at: "2025-06-12T16:40:00Z",
    },
    {
      id: 104,
      name: "Marcus Chen",
      email: "marcus@bell3.net",
      role: "creator",
      balance_coins: 320,
      lifetime_purchased_coins: 500,
      lifetime_spent_coins: 80,
      lifetime_withdrawn_coins: 100,
      is_active: true,
      last_transaction_at: "2025-06-13T11:05:00Z",
    },
    {
      id: 105,
      name: "Aisha Khan",
      email: "aisha@bell3.net",
      role: "creator",
      balance_coins: 180,
      lifetime_purchased_coins: 1200,
      lifetime_spent_coins: 70,
      lifetime_withdrawn_coins: 950,
      is_active: false,
      last_transaction_at: "2025-06-08T08:30:00Z",
    },
  ],
});

function readStore() {
  if (typeof window === "undefined") return seedData();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const data = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const data = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
}

function writeStore(data) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

function nextId(items) {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

export { COINS_PER_DOLLAR };

export const financeMock = {
  getCoinPackages() {
    return readStore().coinPackages;
  },

  createCoinPackage(payload) {
    const store = readStore();
    const pkg = {
      id: nextId(store.coinPackages),
      ...payload,
      created_at: new Date().toISOString(),
    };
    store.coinPackages.unshift(pkg);
    writeStore(store);
    return pkg;
  },

  updateCoinPackage(id, payload) {
    const store = readStore();
    const index = store.coinPackages.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Package not found");
    store.coinPackages[index] = { ...store.coinPackages[index], ...payload };
    writeStore(store);
    return store.coinPackages[index];
  },

  toggleCoinPackage(id, is_active) {
    return this.updateCoinPackage(id, { is_active });
  },

  getTransactions(filters = {}) {
    let items = [...readStore().transactions];
    if (filters.type) {
      items = items.filter((t) => t.type === filters.type);
    }
    if (filters.status) {
      items = items.filter((t) => t.status === filters.status);
    }
    return items.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  },

  getWithdrawals(filters = {}) {
    let items = [...readStore().withdrawals];
    if (filters.status) {
      items = items.filter((w) => w.status === filters.status);
    }
    return items.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  },

  reviewWithdrawal(id, { status, admin_remarks }) {
    const store = readStore();
    const index = store.withdrawals.findIndex((w) => w.id === id);
    if (index === -1) throw new Error("Withdrawal not found");

    store.withdrawals[index] = {
      ...store.withdrawals[index],
      status,
      admin_remarks,
      processed_at: new Date().toISOString(),
    };

    const txIndex = store.transactions.findIndex(
      (t) =>
        t.type === "withdrawal" &&
        t.user_id === store.withdrawals[index].user_id &&
        t.status === "pending"
    );
    if (txIndex !== -1) {
      store.transactions[txIndex].status =
        status === "approved" ? "completed" : status;
    }

    writeStore(store);
    return store.withdrawals[index];
  },

  getCreators() {
    return readStore().creators;
  },

  toggleCreatorSuspension(id, { is_suspended, suspension_reason }) {
    const store = readStore();
    const index = store.creators.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Creator not found");
    store.creators[index] = {
      ...store.creators[index],
      is_suspended,
      suspension_reason: is_suspended ? suspension_reason : null,
    };
    writeStore(store);
    return store.creators[index];
  },

  getUserWallets() {
    return readStore().userWallets;
  },

  getUserTransactions(userId) {
    return readStore()
      .transactions.filter((t) => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  updateUserWalletStatus(id, { is_active }) {
    const store = readStore();
    const index = store.userWallets.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    store.userWallets[index] = { ...store.userWallets[index], is_active };
    writeStore(store);
    return store.userWallets[index];
  },

  exportReport(type = "all") {
    const store = readStore();
    const data = {
      exported_at: new Date().toISOString(),
      coin_packages: store.coinPackages,
      transactions:
        type === "all"
          ? store.transactions
          : store.transactions.filter((t) => t.type === type),
      withdrawals: store.withdrawals,
      summary: {
        total_purchases: store.transactions.filter(
          (t) => t.type === "purchase" && t.status === "completed"
        ).length,
        total_gifts: store.transactions.filter((t) => t.type === "gift").length,
        total_withdrawals: store.withdrawals.length,
        pending_withdrawals: store.withdrawals.filter(
          (w) => w.status === "pending"
        ).length,
        total_revenue_usd: store.transactions
          .filter((t) => t.type === "purchase" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount_usd, 0),
      },
    };
    return data;
  },
};
