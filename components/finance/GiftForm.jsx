import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import {
  DEFAULT_GIFT_ICON_KEY,
  GIFT_ICON_OPTIONS,
  GiftIcon,
  normalizeGiftIconKey,
} from "@/components/finance/giftIcons";

const schema = yup.object({
  name: yup.string().required("Gift name is required"),
  coins: yup
    .number()
    .typeError("Coins must be a number")
    .positive("Coins must be greater than 0")
    .required("Coin cost is required"),
  icon: yup.string().default(DEFAULT_GIFT_ICON_KEY),
});

const GiftForm = ({
  formId = "gift-form",
  initialData,
  onSubmit,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      coins: initialData?.coins || 100,
      icon: normalizeGiftIconKey(initialData?.icon),
    },
  });

  const selectedIconKey = watch("icon");

  const handleFormSubmit = (data) => {
    const coinCost = Number(data.coins);
    onSubmit({
      name: data.name.trim(),
      coins: coinCost,
      coin_cost: coinCost,
      icon: normalizeGiftIconKey(data.icon),
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-100 text-warning-500">
            <GiftIcon icon={selectedIconKey} className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preview
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Stored as <code className="text-xs text-slate-500">{selectedIconKey || DEFAULT_GIFT_ICON_KEY}</code> in the database
            </p>
          </div>
        </div>
      </div>

      <Textinput
        label="Gift Name"
        placeholder="e.g. Flower, Pot of Gold"
        register={register}
        name="name"
        error={errors.name}
      />

      <div>
        <label className="form-label mb-2 block capitalize">Coin Cost</label>
        <Controller
          name="coins"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              min="1"
              step="1"
              placeholder="100"
              value={field.value ?? ""}
              onChange={(e) => {
                const next = e.target.value;
                field.onChange(next === "" ? "" : Number(next));
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              className={`form-control w-full py-2 ${errors.coins ? "has-error" : ""}`}
            />
          )}
        />
        {errors.coins && (
          <p className="mt-1 text-sm text-danger-500">{errors.coins.message}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          How many coins a user pays to send this gift (e.g. Flower = 100, Pot = 500)
        </p>
      </div>

      <div>
        <label className="form-label mb-2 block capitalize">Icon</label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {GIFT_ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => field.onChange(opt.key)}
                  title={`${opt.label} (${opt.key})`}
                  className={`flex flex-col items-center justify-center gap-1 border py-2 transition-colors ${
                    field.value === opt.key
                      ? "border-slate-700 bg-slate-100 text-warning-500"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  <GiftIcon icon={opt.key} className="text-xl" />
                  <span className="text-[10px] leading-tight text-slate-500">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        />
      </div>
    </form>
  );
};

export default GiftForm;
