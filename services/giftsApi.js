import { apiFetch, apiFetchForm } from "@/configs/api";
import { normalizeGiftIconKey } from "@/components/finance/giftIcons";

const BASE = "wallet/gifts";

function toFormBody(fields) {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "number" && Number.isNaN(value)) return;
    params.append(key, String(value));
  });
  return params;
}

export function normalizeGift(gift) {
  if (!gift) return null;

  const status = gift.status;
  const is_active = status === "1" || status === 1 || status === true;
  const coinCost = gift.coin_cost ?? gift.coins;

  return {
    id: Number(gift.id),
    name: gift.name ?? "",
    coins: Number(coinCost) || 0,
    coin_cost: Number(coinCost) || 0,
    icon: normalizeGiftIconKey(gift.icon),
    status: String(status ?? "1"),
    is_active,
    created_at: gift.created_at,
    updated_at: gift.updated_at,
  };
}

function unwrapList(res) {
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res)
      ? res
      : [];
  return raw.map(normalizeGift);
}

function unwrapOne(res) {
  return normalizeGift(res?.data ?? res);
}

function giftDeletePayload(gift) {
  const status =
    gift.is_active === false || gift.status === 0 || gift.status === "0"
      ? "0"
      : "1";

  return {
    id: gift.id,
    name: gift.name,
    icon: gift.icon,
    coin_cost: gift.coins ?? gift.coin_cost,
    status,
  };
}

export const giftsApi = {
  list() {
    return apiFetch(BASE).then((res) => ({
      data: unwrapList(res),
      raw: res,
    }));
  },

  show(id) {
    return apiFetch(`${BASE}/${id}`).then((res) => ({
      data: unwrapOne(res),
      raw: res,
    }));
  },

  create({ name, coin_cost, icon, status = "1" }) {
    const cost = Number(coin_cost);
    if (!cost || Number.isNaN(cost)) {
      return Promise.reject(
        Object.assign(new Error("Coin cost is required"), {
          status: 422,
          data: {
            message: "Coin cost is required",
            errors: { coin_cost: ["Coin cost is required"] },
          },
        })
      );
    }

    return apiFetchForm(
      BASE,
      toFormBody({ name, coin_cost: cost, icon, status })
    ).then((res) => ({
      data: unwrapOne(res),
      raw: res,
    }));
  },

  update({ id, name, coin_cost, icon, status }) {
    const cost = Number(coin_cost);
    return apiFetchForm(
      `${BASE}/update`,
      toFormBody({
        id,
        name,
        coin_cost: Number.isNaN(cost) ? undefined : cost,
        icon,
        status,
      })
    ).then((res) => ({
      data: unwrapOne(res),
      raw: res,
    }));
  },

  destroy(gift) {
    return apiFetchForm(
      `${BASE}/delete`,
      toFormBody(giftDeletePayload(gift))
    );
  },

  toggle(gift) {
    const nextStatus = gift.is_active ? "0" : "1";
    return this.update({
      id: gift.id,
      name: gift.name,
      coin_cost: gift.coins,
      icon: gift.icon,
      status: nextStatus,
    });
  },
};
