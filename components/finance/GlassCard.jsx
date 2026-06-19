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
      className={`border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {(title || subtitle || headerSlot) && (
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
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
