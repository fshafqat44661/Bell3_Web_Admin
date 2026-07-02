const STORAGE_KEY = "bell3_gifts_data";

const seedData = () => ({
  gifts: [
    {
      id: 1,
      name: "Flower",
      coins: 100,
      icon: "flower",
      status: "1",
      is_active: true,
      created_at: "2025-06-01T10:00:00Z",
      updated_at: "2025-06-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Pot of Gold",
      coins: 500,
      icon: "pot",
      status: "1",
      is_active: true,
      created_at: "2025-06-01T10:00:00Z",
      updated_at: "2025-06-01T10:00:00Z",
    },
    {
      id: 3,
      name: "Rose",
      coins: 250,
      icon: "rose",
      status: "1",
      is_active: true,
      created_at: "2025-06-02T14:00:00Z",
      updated_at: "2025-06-02T14:00:00Z",
    },
    {
      id: 4,
      name: "Crown",
      coins: 1000,
      icon: "crown",
      status: "0",
      is_active: false,
      created_at: "2025-06-03T09:00:00Z",
      updated_at: "2025-06-03T09:00:00Z",
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

export const giftsMock = {
  getGifts() {
    return readStore().gifts;
  },

  getGift(id) {
    const gift = readStore().gifts.find((g) => g.id === Number(id));
    if (!gift) throw Object.assign(new Error("Gift not found"), { status: 404 });
    return gift;
  },

  createGift(payload) {
    const store = readStore();
    const gift = {
      id: nextId(store.gifts),
      name: payload.name,
      coins: Number(payload.coins),
      icon: payload.icon || "gift",
      status: payload.is_active === false ? "0" : "1",
      is_active: payload.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.gifts.unshift(gift);
    writeStore(store);
    return gift;
  },

  updateGift(id, payload) {
    const store = readStore();
    const index = store.gifts.findIndex((g) => g.id === Number(id));
    if (index === -1) throw Object.assign(new Error("Gift not found"), { status: 404 });

    const status =
      payload.is_active !== undefined
        ? payload.is_active
          ? "1"
          : "0"
        : store.gifts[index].status;

    store.gifts[index] = {
      ...store.gifts[index],
      ...payload,
      coins: payload.coins !== undefined ? Number(payload.coins) : store.gifts[index].coins,
      status,
      is_active: status === "1",
      updated_at: new Date().toISOString(),
    };
    writeStore(store);
    return store.gifts[index];
  },

  deleteGift(id) {
    const store = readStore();
    const index = store.gifts.findIndex((g) => g.id === Number(id));
    if (index === -1) throw Object.assign(new Error("Gift not found"), { status: 404 });
    store.gifts.splice(index, 1);
    writeStore(store);
    return { success: true };
  },
};
