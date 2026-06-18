import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, {
  formatCoins,
  formatDate,
} from "@/components/finance/financeUtils";
import Button from "@/components/ui/Button";

const UserWalletsTable = ({
  wallets,
  isLoading,
  onViewHistory,
  onToggleStatus,
  actionLoadingId,
}) => {
  return (
    <GlassCard bodyClass="p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-600/40">
              <th className="table-th text-left">User</th>
              <th className="table-th text-left">Role</th>
              <th className="table-th text-left">Balance</th>
              <th className="table-th text-left">Purchased</th>
              <th className="table-th text-left">Spent</th>
              <th className="table-th text-left">Withdrawn</th>
              <th className="table-th text-left">Status</th>
              <th className="table-th text-left">Last Activity</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="table-td py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : wallets.length === 0 ? (
              <tr>
                <td colSpan={9} className="table-td py-12 text-center text-slate-500">
                  No user wallets found.
                </td>
              </tr>
            ) : (
              wallets.map((wallet) => (
                <tr
                  key={wallet.id}
                  className="border-b border-slate-100/80 transition-colors hover:bg-white/40 dark:border-slate-700/40 dark:hover:bg-slate-700/20"
                >
                  <td className="table-td">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {wallet.name}
                      </p>
                      <p className="text-xs text-slate-500">{wallet.email}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary-500">
                      {wallet.role}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="inline-flex items-center gap-1 text-lg font-bold text-slate-800 dark:text-white">
                      <CoinIcon size={16} />
                      {formatCoins(wallet.balance_coins)}
                    </span>
                  </td>
                  <td className="table-td text-slate-600">
                    {formatCoins(wallet.lifetime_purchased_coins)}
                  </td>
                  <td className="table-td text-slate-600">
                    {formatCoins(wallet.lifetime_spent_coins)}
                  </td>
                  <td className="table-td text-slate-600">
                    {formatCoins(wallet.lifetime_withdrawn_coins)}
                  </td>
                  <td className="table-td">
                    <FinanceStatusBadge
                      status={wallet.is_active ? "active" : "inactive"}
                    />
                  </td>
                  <td className="table-td text-sm text-slate-500">
                    {formatDate(wallet.last_transaction_at)}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewHistory(wallet)}
                        className="rounded-lg p-2 text-primary-500 transition-colors hover:bg-primary-500/10"
                        title="Transaction history"
                      >
                        <Icon icon="heroicons:clock" className="text-lg" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(wallet)}
                        disabled={actionLoadingId === wallet.id}
                        className={`rounded-lg p-2 transition-colors ${
                          wallet.is_active
                            ? "text-danger-500 hover:bg-danger-500/10"
                            : "text-success-500 hover:bg-success-500/10"
                        }`}
                        title={wallet.is_active ? "Deactivate wallet" : "Activate wallet"}
                      >
                        <Icon
                          icon={
                            wallet.is_active
                              ? "heroicons:lock-closed"
                              : "heroicons:lock-open"
                          }
                          className="text-lg"
                        />
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

export default UserWalletsTable;
