import { apiFetch } from "@/configs/api";
import { financeMock } from "@/services/financeMock";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_FINANCE_MOCK !== "false";

async function withFallback(apiCall, mockCall) {
  if (!USE_MOCK) {
    return apiCall();
  }

  try {
    return await apiCall();
  } catch (error) {
    if (error.status === 404 || error.status >= 500 || !error.status) {
      return mockCall();
    }
    throw error;
  }
}

export const financeApi = {
  getCoinPackages: () =>
    withFallback(
      () => apiFetch("admin/coin-packages"),
      () => ({ data: financeMock.getCoinPackages() })
    ),

  createCoinPackage: (payload) =>
    withFallback(
      () =>
        apiFetch("admin/coin-packages", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      () => ({ data: financeMock.createCoinPackage(payload) })
    ),

  updateCoinPackage: (id, payload) =>
    withFallback(
      () =>
        apiFetch(`admin/coin-packages/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }),
      () => ({ data: financeMock.updateCoinPackage(id, payload) })
    ),

  toggleCoinPackage: (id, is_active) =>
    withFallback(
      () =>
        apiFetch(`admin/coin-packages/${id}/toggle`, {
          method: "PATCH",
          body: JSON.stringify({ is_active }),
        }),
      () => ({ data: financeMock.toggleCoinPackage(id, is_active) })
    ),

  getTransactions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const query = params ? `?${params}` : "";
    return withFallback(
      () => apiFetch(`admin/transactions${query}`),
      () => ({ data: financeMock.getTransactions(filters) })
    );
  },

  getWithdrawals: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const query = params ? `?${params}` : "";
    return withFallback(
      () => apiFetch(`admin/withdrawals${query}`),
      () => ({ data: financeMock.getWithdrawals(filters) })
    );
  },

  reviewWithdrawal: (id, payload) =>
    withFallback(
      () =>
        apiFetch(`admin/withdrawals/${id}/review`, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      () => ({ data: financeMock.reviewWithdrawal(id, payload) })
    ),

  getCreators: () =>
    withFallback(
      () => apiFetch("admin/creators/finance"),
      () => ({ data: financeMock.getCreators() })
    ),

  toggleCreatorSuspension: (id, payload) =>
    withFallback(
      () =>
        apiFetch(`admin/creators/${id}/suspension`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      () => ({ data: financeMock.toggleCreatorSuspension(id, payload) })
    ),

  getUserWallets: () =>
    withFallback(
      () => apiFetch("admin/wallets"),
      () => ({ data: financeMock.getUserWallets() })
    ),

  getUserTransactions: (userId) =>
    withFallback(
      () => apiFetch(`admin/wallets/${userId}/transactions`),
      () => ({ data: financeMock.getUserTransactions(userId) })
    ),

  updateUserWalletStatus: (id, payload) =>
    withFallback(
      () =>
        apiFetch(`admin/wallets/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      () => ({ data: financeMock.updateUserWalletStatus(id, payload) })
    ),

  exportReport: (type = "all") =>
    withFallback(
      () => apiFetch(`admin/transactions/export?type=${type}`),
      () => ({ data: financeMock.exportReport(type) })
    ),
};
