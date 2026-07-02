import React from "react";
import { Icon } from "@iconify/react";

/**
 * Short keys saved in DB → Iconify icon ids rendered in the UI.
 * Add new entries here when you need more gift icons.
 */
export const GIFT_ICON_MAP = {
  gift: "heroicons:gift",
  flower: "mdi:flower",
  heart: "heroicons:heart",
  rose: "mdi:flower-tulip",
  star: "heroicons:star",
  crown: "mdi:crown",
  pot: "mdi:pot-steam",
  sparkles: "heroicons:sparkles",
  diamond: "mdi:diamond-stone",
  fire: "heroicons:fire",
  sun: "heroicons:sun",
  bolt: "heroicons:bolt",
  smile: "heroicons:face-smile",
  trophy: "heroicons:trophy",
  rocket: "heroicons:rocket-launch",
};

export const DEFAULT_GIFT_ICON_KEY = "gift";

/** Picker options — `key` is what gets stored in the database */
export const GIFT_ICON_OPTIONS = [
  { key: "gift", label: "Gift box" },
  { key: "flower", label: "Flower" },
  { key: "heart", label: "Heart" },
  { key: "rose", label: "Rose" },
  { key: "star", label: "Star" },
  { key: "crown", label: "Crown" },
  { key: "pot", label: "Pot" },
  { key: "sparkles", label: "Sparkles" },
  { key: "diamond", label: "Diamond" },
  { key: "fire", label: "Fire" },
  { key: "sun", label: "Sun" },
  { key: "bolt", label: "Bolt" },
  { key: "smile", label: "Smile" },
  { key: "trophy", label: "Trophy" },
  { key: "rocket", label: "Rocket" },
];

/**
 * Normalize API value to a registry key.
 * Supports legacy rows that stored full iconify strings.
 */
export function normalizeGiftIconKey(iconValue) {
  if (!iconValue) return DEFAULT_GIFT_ICON_KEY;

  const trimmed = String(iconValue).trim().toLowerCase();

  if (GIFT_ICON_MAP[trimmed]) {
    return trimmed;
  }

  const byIconify = Object.entries(GIFT_ICON_MAP).find(
    ([, iconify]) => iconify.toLowerCase() === trimmed || iconify === iconValue
  );
  if (byIconify) {
    return byIconify[0];
  }

  return DEFAULT_GIFT_ICON_KEY;
}

/** Resolve DB key → Iconify icon id for rendering */
export function resolveGiftIcon(iconValue) {
  const key = normalizeGiftIconKey(iconValue);
  return GIFT_ICON_MAP[key] || GIFT_ICON_MAP[DEFAULT_GIFT_ICON_KEY];
}

export function getGiftIconLabel(iconValue) {
  const key = normalizeGiftIconKey(iconValue);
  return GIFT_ICON_OPTIONS.find((o) => o.key === key)?.label ?? key;
}

export function GiftIcon({ icon, className = "text-lg", size }) {
  return (
    <Icon
      icon={resolveGiftIcon(icon)}
      className={className}
      width={size}
      height={size}
    />
  );
}
