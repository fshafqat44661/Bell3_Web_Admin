import React from "react";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, {
  formatCoins,
  formatUsd,
  formatDate,
} from "@/components/finance/financeUtils";

const WalletHistoryModal = ({ user, transactions, isLoading }) => {
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Current Balance</p>
            <p className="flex items-center justify-end gap-1 text-2xl font-bold">
              <CoinIcon size={22} />
              {formatCoins(user.balance_coins)}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <p className="py-8 text-center text-slate-500">No transactions yet.</p>
      ) : (
        <div className="max-h-[360px] space-y-2 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/60 px-4 py-3 dark:border-slate-600/40 dark:bg-slate-700/30"
            >
              <div>
                <p className="text-sm font-medium capitalize text-slate-800 dark:text-white">
                  {tx.type}
                  {tx.recipient_name && (
                    <span className="text-warning-500"> → {tx.recipient_name}</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1 font-semibold">
                  <CoinIcon size={14} />
                  {formatCoins(tx.coins)}
                </p>
                {tx.amount_usd > 0 && (
                  <p className="text-xs text-slate-500">{formatUsd(tx.amount_usd)}</p>
                )}
                <FinanceStatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletHistoryModal;
