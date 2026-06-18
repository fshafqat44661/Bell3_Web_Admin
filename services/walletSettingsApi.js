import { apiFetch } from "@/configs/api";

export const COIN_PER_DOLLAR_KEY = "coin_per_dollar";

export const walletSettingsApi = {
  getAll: () => apiFetch("wallet/settings"),

  getByKey: (key) => apiFetch(`wallet/settings/${key}`),

  create: ({ key, value }) =>
    apiFetch("wallet/settings", {
      method: "POST",
      body: JSON.stringify({ key, value: String(value) }),
    }),

  update: ({ key, value }) =>
    apiFetch("wallet/settings/update", {
      method: "POST",
      body: JSON.stringify({ key, value: String(value) }),
    }),

  delete: (key) =>
    apiFetch("wallet/settings/delete", {
      method: "POST",
      body: JSON.stringify({ key }),
    }),

  async getCoinPerDollar() {
    try {
      const res = await this.getByKey(COIN_PER_DOLLAR_KEY);
      return res?.data ?? null;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  },

  async saveCoinPerDollar(value, existing = null) {
    const payload = { key: COIN_PER_DOLLAR_KEY, value: String(value) };
    if (existing) {
      return this.update(payload);
    }
    return this.create(payload);
  },
};
