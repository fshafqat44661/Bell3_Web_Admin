import React from "react";
import { Icon } from "@iconify/react";

const FinanceStatCard = ({ label, value, subValue, icon, accent = "primary" }) => {
  const accents = {
    primary: "bg-primary-500/10 text-primary-500",
    success: "bg-success-500/10 text-success-500",
    warning: "bg-warning-500/10 text-warning-500",
    danger: "bg-danger-500/10 text-danger-500",
    info: "bg-info-500/10 text-info-500",
  };

  return (
    <div className="border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
            {value}
          </p>
          {subValue && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subValue}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center ${accents[accent]}`}
        >
          <Icon icon={icon} className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default FinanceStatCard;
