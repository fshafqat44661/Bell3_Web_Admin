import React from "react";

const GlassCard = ({
  children,
  className = "",
  title,
  subtitle,
  headerSlot,
  bodyClass = "p-6",
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/30 bg-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-600/40 dark:bg-slate-800/50 dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${className}`}
    >
      {(title || subtitle || headerSlot) && (
        <div className="flex items-start justify-between border-b border-white/40 px-6 py-4 dark:border-slate-600/40">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerSlot}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </div>
  );
};

export default GlassCard;
