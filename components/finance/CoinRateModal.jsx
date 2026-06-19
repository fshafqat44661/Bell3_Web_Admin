import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Textinput from "@/components/ui/Textinput";
import { formatDate } from "@/components/finance/financeUtils";

const CoinRateModal = ({
  formId = "coin-rate-form",
  setting,
  onSave,
}) => {
  const isCreate = !setting;
  const [rate, setRate] = useState("10");
  const [error, setError] = useState("");

  useEffect(() => {
    setRate(setting?.value ? String(setting.value) : "10");
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

  const previewCoins = Number(rate) || 0;

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/40">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200">
            <Icon icon="heroicons:currency-dollar" className="text-lg" />
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">
              {isCreate ? "Set the base coin rate" : "Update the base coin rate"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create once, then update only. Applies across the platform.
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

      <div className="border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/40">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Preview
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
          $1 = {previewCoins} coins
        </p>
        <p className="mt-1 text-sm text-slate-500">
          A $10 package = {previewCoins * 10} coins (before bonus)
        </p>
      </div>

      {setting?.updated_at && (
        <p className="text-xs text-slate-500">
          Last updated: {formatDate(setting.updated_at)}
        </p>
      )}
    </form>
  );
};

export default CoinRateModal;
