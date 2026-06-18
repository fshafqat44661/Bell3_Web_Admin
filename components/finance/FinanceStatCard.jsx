import React from "react";
import { Icon } from "@iconify/react";

const FinanceStatCard = ({ label, value, subValue, icon, accent = "primary" }) => {
  const accents = {
    primary: "from-primary-500/20 to-primary-500/5 text-primary-500",
    success: "from-success-500/20 to-success-500/5 text-success-500",
    warning: "from-warning-500/20 to-warning-500/5 text-warning-500",
    danger: "from-danger-500/20 to-danger-500/5 text-danger-500",
    info: "from-info-500/20 to-info-500/5 text-info-500",
  };

  return (
    <div className="rounded-2xl border border-white/30 bg-white/60 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-600/40 dark:bg-slate-800/50">
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
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]}`}
        >
          <Icon icon={icon} className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default FinanceStatCard;
