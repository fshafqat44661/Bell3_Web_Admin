import { apiFetch } from "@/configs/api";
import { financeMock } from "@/services/financeMock";
import { packagesApi } from "@/services/packagesApi";

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

function toApiStatus(isActive) {
  return isActive === false ? "0" : "1";
}

export const financeApi = {
  getCoinPackages: (coinsPerDollar = 10) =>
    withFallback(
      () => packagesApi.list(coinsPerDollar),
      () => ({ data: financeMock.getCoinPackages() })
    ),

  getCoinPackage: (id, coinsPerDollar = 10) =>
    withFallback(
      () => packagesApi.show(id, coinsPerDollar),
      () => {
        const pkg = financeMock.getCoinPackages().find((p) => p.id === id);
        if (!pkg) throw Object.assign(new Error("Package not found"), { status: 404 });
        return { data: pkg };
      }
    ),

  createCoinPackage: (payload, coinsPerDollar = 10) =>
    withFallback(
      () =>
        packagesApi.create(
          {
            name: payload.name,
            coins: payload.coins,
            bonus_coins: payload.bonus_coins ?? 0,
            status: toApiStatus(payload.is_active),
          },
          coinsPerDollar
        ),
      () => ({ data: financeMock.createCoinPackage(payload) })
    ),

  updateCoinPackage: (id, payload, coinsPerDollar = 10) =>
    withFallback(
      () =>
        packagesApi.update(
          {
            id,
            name: payload.name,
            coins: payload.coins,
            bonus_coins: payload.bonus_coins ?? 0,
            status: toApiStatus(
              payload.is_active !== undefined ? payload.is_active : true
            ),
          },
          coinsPerDollar
        ),
      () => ({ data: financeMock.updateCoinPackage(id, payload) })
    ),

  toggleCoinPackage: (pkg, coinsPerDollar = 10) =>
    withFallback(
      () => packagesApi.toggle(pkg, coinsPerDollar),
      () => ({ data: financeMock.toggleCoinPackage(pkg.id, !pkg.is_active) })
    ),

  deleteCoinPackage: (id) =>
    withFallback(
      () => packagesApi.destroy(id),
      () => ({ data: financeMock.deleteCoinPackage(id) })
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
