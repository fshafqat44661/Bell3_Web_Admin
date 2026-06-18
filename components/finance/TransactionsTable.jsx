import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";
import CoinIcon, {
  formatCoins,
  formatUsd,
  formatDate,
} from "@/components/finance/financeUtils";

const typeIcons = {
  purchase: "heroicons:shopping-cart",
  gift: "heroicons:gift",
  withdrawal: "heroicons:arrow-up-tray",
};

const typeColors = {
  purchase: "text-primary-500 bg-primary-500/10",
  gift: "text-warning-500 bg-warning-500/10",
  withdrawal: "text-danger-500 bg-danger-500/10",
};

const TransactionsTable = ({ transactions, isLoading, showType = true }) => {
  return (
    <GlassCard bodyClass="p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-600/40">
              {showType && <th className="table-th text-left">Type</th>}
              <th className="table-th text-left">User</th>
              <th className="table-th text-left">Coins</th>
              <th className="table-th text-left">Amount</th>
              <th className="table-th text-left">Reference</th>
              <th className="table-th text-left">Stripe</th>
              <th className="table-th text-left">Status</th>
              <th className="table-th text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={showType ? 8 : 7} className="table-td py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={showType ? 8 : 7}
                  className="table-td py-12 text-center text-slate-500"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-100/80 transition-colors hover:bg-white/40 dark:border-slate-700/40 dark:hover:bg-slate-700/20"
                >
                  {showType && (
                    <td className="table-td">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${typeColors[tx.type]}`}
                      >
                        <Icon icon={typeIcons[tx.type]} />
                        {tx.type}
                      </span>
                    </td>
                  )}
                  <td className="table-td">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {tx.user_name}
                      </p>
                      <p className="text-xs text-slate-500">{tx.user_email}</p>
                      {tx.recipient_name && (
                        <p className="text-xs text-warning-500">
                          → {tx.recipient_name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <CoinIcon size={14} />
                      {formatCoins(tx.coins)}
                    </span>
                  </td>
                  <td className="table-td font-medium">
                    {tx.amount_usd ? formatUsd(tx.amount_usd) : "—"}
                  </td>
                  <td className="table-td">
                    <code className="text-xs text-slate-500">{tx.reference}</code>
                  </td>
                  <td className="table-td">
                    {tx.stripe_payment_id ? (
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-700">
                        {tx.stripe_payment_id.slice(0, 14)}…
                      </code>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="table-td">
                    <FinanceStatusBadge status={tx.status} />
                  </td>
                  <td className="table-td text-sm text-slate-500">
                    {formatDate(tx.created_at)}
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

export default TransactionsTable;
