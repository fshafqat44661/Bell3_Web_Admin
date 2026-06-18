import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { COINS_PER_DOLLAR } from "@/services/financeMock";

const schema = yup.object({
  name: yup.string().required("Package name is required"),
  coins: yup
    .number()
    .typeError("Coins must be a number")
    .positive("Coins must be positive")
    .required("Coins amount is required"),
  price_usd: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  bonus_coins: yup.number().min(0, "Bonus cannot be negative").default(0),
  stripe_price_id: yup.string().required("Stripe Price ID is required"),
});

const CoinPackageForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      coins: initialData?.coins || 100,
      price_usd: initialData?.price_usd || 10,
      bonus_coins: initialData?.bonus_coins || 0,
      stripe_price_id: initialData?.stripe_price_id || "",
    },
  });

  const priceUsd = watch("price_usd");

  useEffect(() => {
    if (!isEdit && priceUsd) {
      setValue("coins", Math.round(priceUsd * COINS_PER_DOLLAR));
    }
  }, [priceUsd, isEdit, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-3 text-sm text-primary-600 dark:text-primary-400">
        Base rate: <strong>$1 = {COINS_PER_DOLLAR} coins</strong>. Price auto-calculates
        coins for new packages.
      </div>

      <Textinput
        label="Package Name"
        placeholder="e.g. Starter Pack"
        register={register}
        name="name"
        error={errors.name}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textinput
          label="Price (USD)"
          type="number"
          step="0.01"
          placeholder="10.00"
          register={register}
          name="price_usd"
          error={errors.price_usd}
        />
        <Textinput
          label="Coins"
          type="number"
          placeholder="100"
          register={register}
          name="coins"
          error={errors.coins}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textinput
          label="Bonus Coins"
          type="number"
          placeholder="0"
          register={register}
          name="bonus_coins"
          error={errors.bonus_coins}
        />
        <Textinput
          label="Stripe Price ID"
          placeholder="price_xxxxxxxx"
          register={register}
          name="stripe_price_id"
          error={errors.stripe_price_id}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          text="Cancel"
          className="bg-slate-200 text-slate-700"
          onClick={onCancel}
        />
        <Button
          type="submit"
          text={isEdit ? "Update Package" : "Create Package"}
          className="bg-primary-500 text-white"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default CoinPackageForm;
