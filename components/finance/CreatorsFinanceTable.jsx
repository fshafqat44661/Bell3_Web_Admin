import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, { formatCoins, formatUsd } from "@/components/finance/financeUtils";
import Button from "@/components/ui/Button";

const CreatorsFinanceTable = ({
  creators,
  isLoading,
  onToggleSuspension,
  actionLoadingId,
}) => {
  return (
    <GlassCard bodyClass="p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-600/40">
              <th className="table-th text-left">Creator</th>
              <th className="table-th text-left">Total Earnings</th>
              <th className="table-th text-left">Pending Withdrawal</th>
              <th className="table-th text-left">Wallet Balance</th>
              <th className="table-th text-left">Gifts Received</th>
              <th className="table-th text-left">Status</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="table-td py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : creators.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-td py-12 text-center text-slate-500">
                  No creators found.
                </td>
              </tr>
            ) : (
              creators.map((creator) => (
                <tr
                  key={creator.id}
                  className="border-b border-slate-100/80 transition-colors hover:bg-white/40 dark:border-slate-700/40 dark:hover:bg-slate-700/20"
                >
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
                        <Icon icon="heroicons:user-circle" className="text-xl" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {creator.name}
                        </p>
                        <p className="text-xs text-slate-500">{creator.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td font-semibold text-success-500">
                    {formatUsd(creator.total_earnings_usd)}
                  </td>
                  <td className="table-td">
                    {creator.pending_withdrawal_usd > 0 ? (
                      <span className="font-medium text-warning-500">
                        {formatUsd(creator.pending_withdrawal_usd)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="table-td">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <CoinIcon size={14} />
                      {formatCoins(creator.wallet_balance_coins)}
                    </span>
                  </td>
                  <td className="table-td">{creator.total_gifts_received}</td>
                  <td className="table-td">
                    {creator.is_suspended ? (
                      <div>
                        <FinanceStatusBadge status="suspended" />
                        <p className="mt-1 max-w-[160px] truncate text-xs text-danger-500">
                          {creator.suspension_reason}
                        </p>
                      </div>
                    ) : (
                      <FinanceStatusBadge status="active" />
                    )}
                  </td>
                  <td className="table-td text-right">
                    <Button
                      text={creator.is_suspended ? "Unsuspend" : "Suspend"}
                      className={
                        creator.is_suspended
                          ? "bg-success-500 text-white btn-sm"
                          : "bg-danger-500 text-white btn-sm"
                      }
                      isLoading={actionLoadingId === creator.id}
                      onClick={() => onToggleSuspension(creator)}
                      icon={
                        creator.is_suspended
                          ? "heroicons:check-circle"
                          : "heroicons:no-symbol"
                      }
                    />
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

export default CreatorsFinanceTable;
