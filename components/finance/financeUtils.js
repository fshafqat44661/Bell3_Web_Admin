import React from "react";
import { Icon } from "@iconify/react";

const CoinIcon = ({ className = "text-warning-500", size = 20 }) => (
  <Icon icon="heroicons:currency-dollar" className={className} width={size} />
);

export const formatCoins = (coins) =>
  new Intl.NumberFormat().format(coins ?? 0);

export const formatUsd = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount ?? 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default CoinIcon;
