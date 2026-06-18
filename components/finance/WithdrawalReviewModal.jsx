import React, { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import CoinIcon, { formatCoins, formatUsd } from "@/components/finance/financeUtils";
import FinanceStatusBadge from "@/components/finance/FinanceStatusBadge";

const WithdrawalReviewModal = ({
  withdrawal,
  onApprove,
  onReject,
  onClose,
  isLoading,
}) => {
  const [remarks, setRemarks] = useState("");

  if (!withdrawal) return null;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              {withdrawal.user_name}
            </p>
            <p className="text-sm text-slate-500">{withdrawal.user_email}</p>
          </div>
          <FinanceStatusBadge status={withdrawal.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Coins Requested</p>
            <p className="mt-1 flex items-center gap-1 text-xl font-bold">
              <CoinIcon size={20} />
              {formatCoins(withdrawal.coins)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">USD Equivalent</p>
            <p className="mt-1 text-xl font-bold text-success-500">
              {formatUsd(withdrawal.amount_usd)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment Method</p>
            <p className="mt-1 font-medium">{withdrawal.payment_method}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment Details</p>
            <p className="mt-1 font-medium">{withdrawal.payment_details}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Admin Remarks
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add notes for approval or rejection reason..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm backdrop-blur-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          text="Cancel"
          className="bg-slate-200 text-slate-700"
          onClick={onClose}
        />
        <Button
          text="Reject"
          className="bg-danger-500 text-white"
          isLoading={isLoading}
          onClick={() => onReject(remarks)}
          icon="heroicons:x-circle"
        />
        <Button
          text="Approve & Send"
          className="bg-success-500 text-white"
          isLoading={isLoading}
          onClick={() => onApprove(remarks)}
          icon="heroicons:check-circle"
        />
      </div>
    </div>
  );
};

export default WithdrawalReviewModal;
