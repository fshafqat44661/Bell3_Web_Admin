import { apiFetch, apiFetchForm } from "@/configs/api";

const BASE = "wallet/packages";

function toFormData(fields) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return formData;
}

export function normalizePackage(pkg, coinsPerDollar = 10) {
  if (!pkg) return null;

  const coins = Number(pkg.coins) || 0;
  const bonus_coins = Number(pkg.bonus_coins) || 0;
  const status = pkg.status;
  const is_active = status === "1" || status === 1 || status === true;

  return {
    id: Number(pkg.id),
    name: pkg.name ?? "",
    coins,
    bonus_coins,
    status: String(status ?? "1"),
    is_active,
    price_usd:
      coinsPerDollar > 0 ? Number((coins / coinsPerDollar).toFixed(2)) : 0,
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
}

function unwrapList(res, coinsPerDollar) {
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res)
      ? res
      : [];
  return raw.map((pkg) => normalizePackage(pkg, coinsPerDollar));
}

function unwrapOne(res, coinsPerDollar) {
  const raw = res?.data ?? res;
  return normalizePackage(raw, coinsPerDollar);
}

export const packagesApi = {
  list(coinsPerDollar = 10) {
    return apiFetch(BASE).then((res) => ({
      data: unwrapList(res, coinsPerDollar),
      raw: res,
    }));
  },

  show(id, coinsPerDollar = 10) {
    return apiFetch(`${BASE}/${id}`).then((res) => ({
      data: unwrapOne(res, coinsPerDollar),
      raw: res,
    }));
  },

  create(
    { name, coins, bonus_coins = 0, status = "1" },
    coinsPerDollar = 10
  ) {
    return apiFetchForm(
      BASE,
      toFormData({ name, coins, bonus_coins, status })
    ).then((res) => ({
      data: unwrapOne(res, coinsPerDollar),
      raw: res,
    }));
  },

  update(
    { id, name, coins, bonus_coins = 0, status },
    coinsPerDollar = 10
  ) {
    return apiFetchForm(
      `${BASE}/update`,
      toFormData({ id, name, coins, bonus_coins, status })
    ).then((res) => ({
      data: unwrapOne(res, coinsPerDollar),
      raw: res,
    }));
  },

  destroy(id) {
    return apiFetchForm(`${BASE}/delete`, toFormData({ id }));
  },

  toggle(pkg, coinsPerDollar = 10) {
    const nextStatus = pkg.is_active ? "0" : "1";
    return this.update(
      {
        id: pkg.id,
        name: pkg.name,
        coins: pkg.coins,
        bonus_coins: pkg.bonus_coins || 0,
        status: nextStatus,
      },
      coinsPerDollar
    );
  },
};
