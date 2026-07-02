import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import { GiftIcon } from "@/components/finance/giftIcons";
import { formatCoins } from "@/components/finance/financeUtils";

const thClass =
  "px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 lg:px-4";
const tdClass =
  "px-3 py-4 text-sm text-slate-600 dark:text-slate-300 lg:px-4 border-b border-slate-200 dark:border-slate-700";

const GiftsTable = ({
  gifts,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  toggleLoadingId,
  deleteLoadingId,
}) => {
  const colCount = 5;

  return (
    <GlassCard
      title="Gift Catalog"
      subtitle="Gifts users can send to creators — each gift costs coins from their wallet"
      bodyClass="overflow-hidden p-0"
      className="max-w-full"
    >
      <div className="w-full max-w-full overflow-hidden">
        <table className="w-full max-w-full table-fixed">
          <colgroup>
            <col className="w-[35%] min-w-0" />
            <col className="w-[20%] min-w-0" />
            <col className="hidden w-[20%] min-w-0 md:table-column" />
            <col className="w-[15%] min-w-0" />
            <col className="w-[10%] min-w-0" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className={thClass}>Gift</th>
              <th className={thClass}>Coin Cost</th>
              <th className={`${thClass} hidden md:table-cell`}>Last Updated</th>
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
            ) : gifts.length === 0 ? (
              <tr>
                <td colSpan={colCount} className={`${tdClass} py-12 text-center text-slate-500`}>
                  No gifts yet. Create your first gift.
                </td>
              </tr>
            ) : (
              gifts.map((gift) => (
                <tr
                  key={gift.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className={tdClass}>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-warning-500/15 text-warning-500">
                        <GiftIcon icon={gift.icon} className="text-lg" />
                      </div>
                      <span
                        className="truncate whitespace-nowrap font-medium text-slate-800 dark:text-white"
                        title={gift.name}
                      >
                        {gift.name}
                      </span>
                    </div>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap font-semibold text-slate-700 dark:text-slate-200`}>
                    {formatCoins(gift.coins)} coins
                  </td>
                  <td className={`${tdClass} hidden whitespace-nowrap text-slate-500 md:table-cell`}>
                    {gift.updated_at
                      ? new Date(gift.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className={tdClass}>
                    <FinanceStatusBadge
                      status={gift.is_active ? "active" : "disabled"}
                    />
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      <button
                        onClick={() => onEdit(gift)}
                        className="p-1.5 text-slate-500 transition-colors hover:bg-primary-500/10 hover:text-primary-500"
                        title="Edit gift"
                      >
                        <Icon icon="heroicons:pencil-square" className="text-base" />
                      </button>
                      <button
                        onClick={() => onToggle(gift)}
                        disabled={toggleLoadingId === gift.id}
                        className={`p-1.5 transition-colors ${
                          gift.is_active
                            ? "text-danger-500 hover:bg-danger-500/10"
                            : "text-success-500 hover:bg-success-500/10"
                        }`}
                        title={gift.is_active ? "Disable gift" : "Enable gift"}
                      >
                        <Icon
                          icon={
                            gift.is_active
                              ? "heroicons:no-symbol"
                              : "heroicons:check-circle"
                          }
                          className="text-base"
                        />
                      </button>
                      <button
                        onClick={() => onDelete(gift)}
                        disabled={deleteLoadingId === gift.id}
                        className="p-1.5 text-danger-500 transition-colors hover:bg-danger-500/10"
                        title="Delete gift"
                      >
                        <Icon icon="heroicons:trash" className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default GiftsTable;
