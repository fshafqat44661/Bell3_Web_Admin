import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { formatDate } from "@/components/finance/financeUtils";

const CoinRateModal = ({
  setting,
  onSave,
  onClose,
  isLoading,
}) => {
  const isCreate = !setting;
  const [rate, setRate] = useState("10");
  const [error, setError] = useState("");

  useEffect(() => {
    if (setting?.value) {
      setRate(String(setting.value));
    } else {
      setRate("10");
    }
    setError("");
  }, [setting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = Number(rate);

    if (!rate || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid number greater than 0");
      return;
    }

    if (!Number.isInteger(parsed)) {
      setError("Use a whole number (e.g. 10)");
      return;
    }

    setError("");
    onSave(parsed);
  };

  const previewUsd = 1;
  const previewCoins = Number(rate) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-warning-500/20 bg-warning-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-500/15 text-warning-500">
            <Icon icon="heroicons:currency-dollar" className="text-xl" />
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">
              {isCreate ? "Set the base coin rate" : "Update the base coin rate"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              This rate applies across the platform. The create API can only be
              used once — after that, changes use update.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Textinput
          label="Coins per $1 (USD)"
          type="number"
          min="1"
          step="1"
          placeholder="e.g. 10"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          description="Example: 10 means users get 10 coins for every $1 spent"
        />
        {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
      </div>

      <div className="rounded-xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-700/30">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Preview
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
          ${previewUsd} = {previewCoins} coins
        </p>
        <p className="mt-1 text-sm text-slate-500">
          A $10 package would include {previewCoins * 10} coins (before bonus)
        </p>
      </div>

      {setting?.updated_at && (
        <p className="text-xs text-slate-500">
          Last updated: {formatDate(setting.updated_at)}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          text="Cancel"
          className="bg-slate-200 text-slate-700"
          onClick={onClose}
        />
        <Button
          type="submit"
          text={isCreate ? "Create Rate" : "Update Rate"}
          className="bg-warning-500 text-white"
          isLoading={isLoading}
          icon={isCreate ? "heroicons:plus-circle" : "heroicons:pencil-square"}
        />
      </div>
    </form>
  );
};

export default CoinRateModal;
