import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, {
  formatCoins,
  formatUsd,
  formatDate,
} from "@/components/finance/financeUtils";
import Button from "@/components/ui/Button";

const WithdrawalsTable = ({
  withdrawals,
  isLoading,
  onReview,
  showActions = true,
}) => {
  return (
    <GlassCard bodyClass="p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-600/40">
              <th className="table-th text-left">User</th>
              <th className="table-th text-left">Coins</th>
              <th className="table-th text-left">USD Value</th>
              <th className="table-th text-left">Payment</th>
              <th className="table-th text-left">Status</th>
              <th className="table-th text-left">Admin Remarks</th>
              <th className="table-th text-left">Requested</th>
              {showActions && <th className="table-th text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={showActions ? 8 : 7} className="table-td py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td
                  colSpan={showActions ? 8 : 7}
                  className="table-td py-12 text-center text-slate-500"
                >
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              withdrawals.map((wd) => (
                <tr
                  key={wd.id}
                  className="border-b border-slate-100/80 transition-colors hover:bg-white/40 dark:border-slate-700/40 dark:hover:bg-slate-700/20"
                >
                  <td className="table-td">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {wd.user_name}
                      </p>
                      <p className="text-xs text-slate-500">{wd.user_email}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <CoinIcon size={14} />
                      {formatCoins(wd.coins)}
                    </span>
                  </td>
                  <td className="table-td font-medium text-success-500">
                    {formatUsd(wd.amount_usd)}
                  </td>
                  <td className="table-td">
                    <div>
                      <p className="text-sm font-medium">{wd.payment_method}</p>
                      <p className="text-xs text-slate-500">{wd.payment_details}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <FinanceStatusBadge status={wd.status} />
                  </td>
                  <td className="table-td max-w-[200px]">
                    <p className="truncate text-sm text-slate-500">
                      {wd.admin_remarks || "—"}
                    </p>
                  </td>
                  <td className="table-td text-sm text-slate-500">
                    {formatDate(wd.created_at)}
                  </td>
                  {showActions && (
                    <td className="table-td text-right">
                      {wd.status === "pending" ? (
                        <Button
                          text="Review"
                          className="bg-primary-500 text-white btn-sm"
                          onClick={() => onReview(wd)}
                          icon="heroicons:eye"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          {formatDate(wd.processed_at)}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default WithdrawalsTable;
