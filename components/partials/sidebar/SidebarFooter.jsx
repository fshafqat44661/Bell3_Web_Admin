"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { handleLogout } from "@/components/partials/auth/store";
import useSidebar from "@/hooks/useSidebar";

const SidebarFooter = ({ forceExpanded = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [collapsed] = useSidebar();
  const [adminUser, setAdminUser] = useState(null);

  const isCompact = !forceExpanded && collapsed;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setAdminUser(raw ? JSON.parse(raw) : null);
    } catch {
      setAdminUser(null);
    }
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuth");
    } catch {
      // ignore
    }
    dispatch(handleLogout(false));
    router.push("/");
  };

  const displayName =
    adminUser?.username ||
    adminUser?.first_name ||
    adminUser?.email ||
    "Admin";

  return (
    <div
      className={`shrink-0 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800 ${
        isCompact ? "px-2" : ""
      }`}
    >
      {!isCompact && (
        <div className="mb-2 truncate px-2 text-xs text-slate-400">
          Signed in as{" "}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {displayName}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={onLogout}
        title="Log out"
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-danger-500/10 hover:text-danger-500 dark:text-slate-300 ${
          isCompact ? "justify-center px-0" : ""
        }`}
      >
        <Icon icon="heroicons-outline:logout" className="text-xl" />
        {!isCompact && <span>Log out</span>}
      </button>
    </div>
  );
};

export default SidebarFooter;
