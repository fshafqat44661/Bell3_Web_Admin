import React from "react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/finance/GlassCard";
import Button from "@/components/ui/Button";

const thClass =
  "px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 lg:px-4";
const tdClass =
  "px-3 py-4 text-sm text-slate-600 dark:text-slate-300 lg:px-4 border-b border-slate-200 dark:border-slate-700";

const ReferralsTable = ({ users, isLoading, onViewDetails }) => {
  const colCount = 4;

  return (
    <GlassCard
      title="Referral Overview"
      subtitle="Users and their referral codes — open Details to see sign-ups"
      bodyClass="overflow-hidden p-0"
      className="max-w-full"
    >
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[28%]" />
            <col className="w-[22%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className={thClass}>User</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Referral Code</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colCount} className={`${tdClass} py-12 text-center`}>
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className={`${tdClass} py-12 text-center text-slate-500`}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className={tdClass}>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-500/15 text-primary-500">
                        {user.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.profileImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Icon icon="heroicons:user" className="text-lg" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="truncate font-medium text-slate-800 dark:text-white"
                          title={user.fullName}
                        >
                          {user.fullName}
                        </p>
                        {user.username ? (
                          <p className="truncate text-xs text-slate-400">
                            @{user.username}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>
                    <span className="truncate" title={user.email}>
                      {user.email || "—"}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-900">
                      {user.referralCode}
                    </code>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <Button
                      text="Details"
                      className="rounded-none bg-slate-700 py-1.5 text-xs text-white"
                      onClick={() => onViewDetails(user)}
                      icon="heroicons:eye"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default ReferralsTable;
