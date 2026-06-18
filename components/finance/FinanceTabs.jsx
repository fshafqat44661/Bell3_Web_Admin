import React from "react";

const FinanceTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/30 bg-white/40 p-1.5 backdrop-blur-xl dark:border-slate-600/40 dark:bg-slate-800/30">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-white text-primary-500 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          {tab.label}
          {tab.count != null && (
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.id
                  ? "bg-primary-500/10 text-primary-500"
                  : "bg-slate-200/80 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FinanceTabs;
