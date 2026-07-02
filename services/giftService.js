import { giftsApi } from "@/services/giftsApi";
import { giftsMock } from "@/services/giftsMock";
import { DEFAULT_GIFT_ICON_KEY } from "@/components/finance/giftIcons";

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

function toApiCoinCost(payload) {
  const raw = payload.coin_cost ?? payload.coins;
  const value = Number(raw);
  return Number.isNaN(value) ? undefined : value;
}

export const giftService = {
  getGifts: () =>
    withFallback(
      () => giftsApi.list(),
      () => ({ data: giftsMock.getGifts() })
    ),

  getGift: (id) =>
    withFallback(
      () => giftsApi.show(id),
      () => ({ data: giftsMock.getGift(id) })
    ),

  createGift: (payload) =>
    withFallback(
      () =>
        giftsApi.create({
          name: payload.name,
          coin_cost: toApiCoinCost(payload),
          icon: payload.icon || DEFAULT_GIFT_ICON_KEY,
          status: toApiStatus(payload.is_active),
        }),
      () => ({ data: giftsMock.createGift(payload) })
    ),

  updateGift: (id, payload) =>
    withFallback(
      () =>
        giftsApi.update({
          id,
          name: payload.name,
          coin_cost: toApiCoinCost(payload),
          icon: payload.icon,
          status: toApiStatus(
            payload.is_active !== undefined ? payload.is_active : true
          ),
        }),
      () => ({ data: giftsMock.updateGift(id, payload) })
    ),

  toggleGift: (gift) =>
    withFallback(
      () => giftsApi.toggle(gift),
      () => ({
        data: giftsMock.updateGift(gift.id, { is_active: !gift.is_active }),
      })
    ),

  deleteGift: (gift) =>
    withFallback(
      () => giftsApi.destroy(gift),
      () => ({ data: giftsMock.deleteGift(gift.id), message: "Gift deleted successfully" })
    ),
};
