import React from "react";

const statusStyles = {
  completed: "bg-success-500/15 text-success-500 border-success-500/30",
  approved: "bg-success-500/15 text-success-500 border-success-500/30",
  active: "bg-success-500/15 text-success-500 border-success-500/30",
  pending: "bg-warning-500/15 text-warning-500 border-warning-500/30",
  rejected: "bg-danger-500/15 text-danger-500 border-danger-500/30",
  disabled: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  inactive: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  suspended: "bg-danger-500/15 text-danger-500 border-danger-500/30",
};

const FinanceStatusBadge = ({ status }) => {
  const key = (status || "pending").toLowerCase();
  const style = statusStyles[key] || statusStyles.pending;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}
    >
      {status}
    </span>
  );
};

export default FinanceStatusBadge;
