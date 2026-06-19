import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, { formatCoins, formatUsd } from "@/components/finance/financeUtils";

const thClass =
  "px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 lg:px-4";
const tdClass =
  "px-3 py-4 text-sm text-slate-600 dark:text-slate-300 lg:px-4 border-b border-slate-200 dark:border-slate-700";

const CoinPackagesTable = ({
  packages,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  toggleLoadingId,
  deleteLoadingId,
  coinsPerDollar = 10,
}) => {
  const colCount = 7;

  return (
    <GlassCard
      title="Coin Packages"
      subtitle={`Manage coin packages — $1 = ${coinsPerDollar} coins`}
      bodyClass="overflow-hidden p-0"
      className="max-w-full"
    >
      <div className="w-full max-w-full overflow-hidden">
        <table className="w-full max-w-full table-fixed">
          <colgroup>
            <col className="w-[28%] min-w-0" />
            <col className="w-[12%] min-w-0" />
            <col className="hidden w-[10%] min-w-0 md:table-column" />
            <col className="w-[12%] min-w-0" />
            <col className="hidden w-[12%] min-w-0 lg:table-column" />
            <col className="w-[12%] min-w-0" />
            <col className="w-[14%] min-w-0" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className={thClass}>Package</th>
              <th className={thClass}>Coins</th>
              <th className={`${thClass} hidden md:table-cell`}>Bonus</th>
              <th className={thClass}>Price</th>
              <th className={`${thClass} hidden lg:table-cell`}>Rate</th>
              <th className={thClass}>Status</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colCount} className={`${tdClass} py-12 text-center`}>
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={colCount} className={`${tdClass} py-12 text-center text-slate-500`}>
                  No coin packages yet. Create your first package.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => {
                const totalCoins = pkg.coins + (pkg.bonus_coins || 0);
                const rate = pkg.price_usd
                  ? (totalCoins / pkg.price_usd).toFixed(1)
                  : coinsPerDollar;

                return (
                  <tr
                    key={pkg.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className={tdClass}>
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-warning-500/15">
                          <CoinIcon size={16} />
                        </div>
                        <span
                          className="truncate whitespace-nowrap font-medium text-slate-800 dark:text-white"
                          title={pkg.name}
                        >
                          {pkg.name}
                        </span>
                      </div>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold text-slate-700 dark:text-slate-200`}>
                      {formatCoins(pkg.coins)}
                    </td>
                    <td className={`${tdClass} hidden whitespace-nowrap text-success-500 md:table-cell`}>
                      {pkg.bonus_coins ? `+${formatCoins(pkg.bonus_coins)}` : "—"}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-medium`}>
                      {formatUsd(pkg.price_usd)}
                    </td>
                    <td className={`${tdClass} hidden whitespace-nowrap text-slate-500 lg:table-cell`}>
                      {rate}/$
                    </td>
                    <td className={tdClass}>
                      <FinanceStatusBadge
                        status={pkg.is_active ? "active" : "disabled"}
                      />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                        <button
                          onClick={() => onEdit(pkg)}
                          className="p-1.5 text-slate-500 transition-colors hover:bg-primary-500/10 hover:text-primary-500"
                          title="Edit package"
                        >
                          <Icon icon="heroicons:pencil-square" className="text-base" />
                        </button>
                        <button
                          onClick={() => onToggle(pkg)}
                          disabled={toggleLoadingId === pkg.id}
                          className={`p-1.5 transition-colors ${
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
                            className="text-base"
                          />
                        </button>
                        <button
                          onClick={() => onDelete(pkg)}
                          disabled={deleteLoadingId === pkg.id}
                          className="p-1.5 text-danger-500 transition-colors hover:bg-danger-500/10"
                          title="Delete package"
                        >
                          <Icon icon="heroicons:trash" className="text-base" />
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
