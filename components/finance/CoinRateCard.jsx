import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import Button from "@/components/ui/Button";
import { formatDate } from "@/components/finance/financeUtils";

const CoinRateCard = ({
  setting,
  coinsPerDollar,
  isLoading,
  onConfigure,
  onDelete,
  isDeleting,
}) => {
  const isConfigured = Boolean(setting);

  return (
    <GlassCard
      title="Base Coin Rate"
      subtitle="Platform-wide conversion: how many coins $1 buys"
      headerSlot={
        <div className="flex flex-wrap gap-2">
          <Button
            text={isConfigured ? "Update Rate" : "Set Up Rate"}
            className="bg-warning-500 text-white btn-sm"
            onClick={onConfigure}
            icon={isConfigured ? "heroicons:pencil-square" : "heroicons:plus-circle"}
          />
          {isConfigured && (
            <Button
              text="Delete Rate"
              className="bg-danger-500 text-white btn-sm"
              onClick={onDelete}
              isLoading={isDeleting}
              icon="heroicons:trash"
            />
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-warning-500 border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center bg-warning-500/15">
            <Icon icon="heroicons:currency-dollar" className="text-3xl text-warning-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {coinsPerDollar} coins <span className="text-lg font-normal text-slate-500">/ $1</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {isConfigured
                ? `Active since ${formatDate(setting.created_at)}`
                : "Not configured yet — set the rate before creating packages"}
            </p>
          </div>
          <div className="border border-slate-200 bg-white px-4 py-3 dark:border-slate-600 dark:bg-slate-800">
            <p className="text-xs text-slate-500">$10 purchase</p>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              {coinsPerDollar * 10} coins
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default CoinRateCard;
