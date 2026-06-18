import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, { formatCoins, formatUsd } from "@/components/finance/financeUtils";
import Button from "@/components/ui/Button";

const CoinPackagesTable = ({
  packages,
  isLoading,
  onEdit,
  onToggle,
  toggleLoadingId,
}) => {
  return (
    <GlassCard title="Coin Packages" subtitle="Manage Stripe coin packages — $1 = 10 coins">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-600/40">
              <th className="table-th text-left">Package</th>
              <th className="table-th text-left">Coins</th>
              <th className="table-th text-left">Bonus</th>
              <th className="table-th text-left">Price</th>
              <th className="table-th text-left">Rate</th>
              <th className="table-th text-left">Stripe ID</th>
              <th className="table-th text-left">Status</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="table-td py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-td py-12 text-center text-slate-500">
                  No coin packages yet. Create your first package.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => {
                const totalCoins = pkg.coins + (pkg.bonus_coins || 0);
                const rate = pkg.price_usd
                  ? (totalCoins / pkg.price_usd).toFixed(1)
                  : "—";

                return (
                  <tr
                    key={pkg.id}
                    className="border-b border-slate-100/80 transition-colors hover:bg-white/40 dark:border-slate-700/40 dark:hover:bg-slate-700/20"
                  >
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-500/15">
                          <CoinIcon size={18} />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {pkg.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-td font-semibold text-slate-700 dark:text-slate-200">
                      {formatCoins(pkg.coins)}
                    </td>
                    <td className="table-td text-success-500">
                      {pkg.bonus_coins ? `+${formatCoins(pkg.bonus_coins)}` : "—"}
                    </td>
                    <td className="table-td font-medium">{formatUsd(pkg.price_usd)}</td>
                    <td className="table-td text-slate-500">{rate} coins/$</td>
                    <td className="table-td">
                      <code className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">
                        {pkg.stripe_price_id || "—"}
                      </code>
                    </td>
                    <td className="table-td">
                      <FinanceStatusBadge
                        status={pkg.is_active ? "active" : "disabled"}
                      />
                    </td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(pkg)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-primary-500/10 hover:text-primary-500"
                          title="Edit pricing"
                        >
                          <Icon icon="heroicons:pencil-square" className="text-lg" />
                        </button>
                        <button
                          onClick={() => onToggle(pkg)}
                          disabled={toggleLoadingId === pkg.id}
                          className={`rounded-lg p-2 transition-colors ${
                            pkg.is_active
                              ? "text-danger-500 hover:bg-danger-500/10"
                              : "text-success-500 hover:bg-success-500/10"
                          }`}
                          title={pkg.is_active ? "Disable package" : "Enable package"}
                        >
                          <Icon
                            icon={
                              pkg.is_active
                                ? "heroicons:no-symbol"
                                : "heroicons:check-circle"
                            }
                            className="text-lg"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default CoinPackagesTable;
