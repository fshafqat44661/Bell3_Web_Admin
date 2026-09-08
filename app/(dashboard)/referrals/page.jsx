"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import ReferralsTable from "@/components/finance/ReferralsTable";
import PaginationBar from "@/components/finance/PaginationBar";
import referralService from "@/services/referralService";
import {
  buildAppInviteLink,
  buildMobileDeepLink,
  buildRegisterInviteLink,
  getStoredAdminUser,
  getWebAppBaseUrl,
  resolveReferralCode,
} from "@/services/referralUtils";

const ReferralsPage = () => {
  const router = useRouter();
  const [adminUser] = useState(() => getStoredAdminUser());
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    pages: 1,
    total: 0,
  });
  const [showInviteTools, setShowInviteTools] = useState(false);
  const [customCode, setCustomCode] = useState("");

  const ownCode = useMemo(() => resolveReferralCode(adminUser), [adminUser]);
  const webBase = getWebAppBaseUrl();
  const ownRegisterLink = buildRegisterInviteLink(ownCode, webBase);
  const ownAppInviteLink = buildAppInviteLink(ownCode, webBase);
  const ownDeepLink = buildMobileDeepLink(ownCode);
  const previewCode = customCode.trim() || ownCode;
  const previewRegisterLink = buildRegisterInviteLink(previewCode, webBase);
  const previewAppInviteLink = buildAppInviteLink(previewCode, webBase);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await referralService.getAllUsers(page, 15, debouncedSearch);
      setUsers(res.data || []);
      setPagination(res.pagination || { current_page: page, pages: 1, total: 0 });
    } catch {
      toast.error("Failed to load referral users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const copyText = async (label, value) => {
    if (!value) {
      toast.error(`No ${label} available to copy`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied successfully`);
    } catch {
      toast.error(`Unable to copy ${label}`);
    }
  };

  const handleViewDetails = (user) => {
    try {
      sessionStorage.setItem(`referral_user_${user.id}`, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
    router.push(`/referrals/${user.id}`);
  };

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Referral Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            See who referred whom, sign-up counts per link, and referral details
          </p>
        </div>
        <Button
          text={showInviteTools ? "Hide Invite Tools" : "Invite Tools"}
          className="rounded-none bg-slate-700 text-white"
          onClick={() => setShowInviteTools((v) => !v)}
          icon="heroicons:link"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FinanceStatCard
          label="Users (this page)"
          value={users.length}
          icon="heroicons:users"
          accent="primary"
        />
        <FinanceStatCard
          label="Total users"
          value={pagination.total || "—"}
          icon="heroicons:globe-alt"
          accent="info"
        />
        <FinanceStatCard
          label="Your referral code"
          value={ownCode || "—"}
          subValue={adminUser?.email || "Logged-in admin"}
          icon="heroicons:ticket"
          accent="success"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search users by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary-500 dark:border-slate-600 dark:bg-slate-800"
          />
          <Icon
            icon="heroicons:magnifying-glass"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <ReferralsTable
        users={users}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      <PaginationBar
        currentPage={pagination.current_page || page}
        totalPages={pagination.pages || 1}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      {showInviteTools && (
        <>
          <div className="border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-white">
                <Icon icon="heroicons:user-plus" className="text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Invite a Friend
                </h2>
                <p className="text-sm text-slate-500">
                  Same invite links as the creator app
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your invite link ({ownCode || "—"})
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    readOnly
                    value={ownRegisterLink}
                    onFocus={(e) => e.target.select()}
                    className="w-full rounded border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <Button
                    text="Copy Link"
                    className="shrink-0 rounded-none bg-primary-500 text-white"
                    onClick={() => copyText("Invite link", ownRegisterLink)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mobile app invite
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    readOnly
                    value={ownAppInviteLink}
                    className="w-full rounded border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <Button
                    text="Copy"
                    className="shrink-0 rounded-none bg-slate-700 text-white"
                    onClick={() => copyText("App invite link", ownAppInviteLink)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Deep link:{" "}
                  <code className="text-primary-500">
                    {ownDeepLink || "bell3:///signup?referral_code=…"}
                  </code>
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Build link for a code
            </h2>
            <p className="mt-1 mb-4 text-sm text-slate-500">
              Enter any referral code to generate register / app-invite URLs
            </p>
            <div className="mb-4 max-w-md">
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder={ownCode || "Enter referral code"}
                className="w-full rounded border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="w-40 shrink-0 text-xs font-semibold uppercase text-slate-500">
                  Web register
                </span>
                <input
                  readOnly
                  value={previewRegisterLink}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <Button
                  text="Copy"
                  className="shrink-0 rounded-none bg-primary-500 text-white"
                  onClick={() =>
                    copyText("Register invite link", previewRegisterLink)
                  }
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="w-40 shrink-0 text-xs font-semibold uppercase text-slate-500">
                  App invite
                </span>
                <input
                  readOnly
                  value={previewAppInviteLink}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <Button
                  text="Copy"
                  className="shrink-0 rounded-none bg-slate-700 text-white"
                  onClick={() =>
                    copyText("App invite link", previewAppInviteLink)
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralsPage;
