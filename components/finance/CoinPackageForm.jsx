import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import Textinput from "@/components/ui/Textinput";
import { formatUsd, formatDate } from "@/components/finance/financeUtils";

const schema = yup.object({
  name: yup.string().required("Package name is required"),
  coins: yup
    .number()
    .typeError("Coins must be a number")
    .positive("Coins must be positive")
    .required("Coins amount is required"),
  bonus_coins: yup.number().min(0, "Bonus cannot be negative").default(0),
});

const CoinPackageForm = ({
  formId = "coin-package-form",
  initialData,
  onSubmit,
  coinsPerDollar = 10,
  coinRateSetting = null,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      coins: initialData?.coins || 100,
      bonus_coins: initialData?.bonus_coins || 0,
    },
  });

  const coins = useWatch({ control, name: "coins" });
  const coinCount = Number(coins) || 0;
  const calculatedPrice =
    coinCount > 0 && coinsPerDollar > 0
      ? Number((coinCount / coinsPerDollar).toFixed(2))
      : 0;

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      coins: Number(data.coins),
      price_usd: Number((Number(data.coins) / coinsPerDollar).toFixed(2)),
      bonus_coins: Number(data.bonus_coins) || 0,
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-slate-600">
            <Icon icon="heroicons:currency-dollar" className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Base Coin Rate
            </p>
            <p className="mt-1 text-lg font-bold text-slate-800">
              {coinsPerDollar} coins / $1
            </p>
            {coinRateSetting ? (
              <p className="mt-1 text-xs text-slate-500">
                Configured · active since {formatDate(coinRateSetting.created_at)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Set up the base rate on the page first
              </p>
            )}
            <p className="mt-1 text-sm text-slate-600">
              Price = coins ÷ {coinsPerDollar}
            </p>
          </div>
        </div>
      </div>

      <Textinput
        label="Package Name"
        placeholder="e.g. Starter Pack"
        register={register}
        name="name"
        error={errors.name}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label mb-2 block capitalize">Coins</label>
          <Controller
            name="coins"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                step="1"
                placeholder="100"
                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                className={`form-control w-full py-2 ${errors.coins ? "has-error" : ""}`}
              />
            )}
          />
          {errors.coins && (
            <p className="mt-1 text-sm text-danger-500">{errors.coins.message}</p>
          )}
        </div>

        <div>
          <label className="form-label mb-2 block capitalize">Bonus Coins</label>
          <Controller
            name="bonus_coins"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                className={`form-control w-full py-2 ${
                  errors.bonus_coins ? "has-error" : ""
                }`}
              />
            )}
          />
          {errors.bonus_coins && (
            <p className="mt-1 text-sm text-danger-500">{errors.bonus_coins.message}</p>
          )}
        </div>
      </div>

      <div className="border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Calculated Price
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-800">
          {formatUsd(calculatedPrice)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {coinCount} coins ÷ {coinsPerDollar} coins/$1 = {formatUsd(calculatedPrice)}
        </p>
      </div>
    </form>
  );
};

export default CoinPackageForm;
