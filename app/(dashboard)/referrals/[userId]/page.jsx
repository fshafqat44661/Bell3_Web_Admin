"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import GlassCard from "@/components/finance/GlassCard";
import PaginationBar from "@/components/finance/PaginationBar";
import referralService from "@/services/referralService";
import {
  buildAppInviteLink,
  buildRegisterInviteLink,
} from "@/services/referralUtils";

const PER_PAGE = 15;

function readCachedUser(userId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`referral_user_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ReferralUserDetailsPage = ({ params }) => {
  const router = useRouter();
  const userId = params?.userId;

  const [knownUser, setKnownUser] = useState(null);
  const [details, setDetails] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    pages: 1,
    total: 0,
    per_page: PER_PAGE,
  });
  const [page, setPage] = useState(1);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setKnownUser(readCachedUser(userId));
    }
  }, [userId]);

  const loadHeader = useCallback(async () => {
    if (!userId) return;
    try {
      setHeaderLoading(true);
      const cached = readCachedUser(userId);
      const detailRes = await referralService.getUserReferralDetails(
        userId,
        cached
      );
      setDetails(detailRes);
      setKnownUser(cached || detailRes);
    } catch {
      toast.error("Failed to load referral user details");
    } finally {
      setHeaderLoading(false);
    }
  }, [userId]);

  const loadReferrals = useCallback(
    async (nextPage = 1) => {
      if (!userId) return;
      try {
        setListLoading(true);
        const listRes = await referralService.getUserReferrals(
          userId,
          nextPage,
          PER_PAGE
        );
        setReferrals(listRes.data || []);
        setPagination(
          listRes.pagination || {
            current_page: nextPage,
            pages: 1,
            total: 0,
            per_page: PER_PAGE,
          }
        );
        setPage(listRes.pagination?.current_page || nextPage);

        setDetails((prev) =>
          prev
            ? {
                ...prev,
                totalReferrals:
                  listRes.pagination?.total ?? prev.totalReferrals,
                statistics: {
                  ...(prev.statistics || {}),
                  totalReferrals:
                    listRes.pagination?.total ?? prev.totalReferrals,
                  activeReferrals:
                    listRes.pagination?.total ?? prev.totalReferrals,
                },
              }
            : prev
        );
      } catch {
        toast.error("Failed to load referred users");
        setReferrals([]);
      } finally {
        setListLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    loadHeader();
    setPage(1);
    loadReferrals(1);
  }, [loadHeader, loadReferrals]);

  const code =
    details?.referralCode || knownUser?.referralCode || `BELL-${userId}`;
  const total =
    details?.totalReferrals ??
    pagination.total ??
    knownUser?.totalReferrals ??
    0;
  const registerLink = buildRegisterInviteLink(code);
  const appLink = buildAppInviteLink(code);
  const displayName =
    details?.fullName || knownUser?.fullName || `User #${userId}`;
  const displayEmail = details?.email || knownUser?.email || "—";
  const displayImage = details?.profileImage || knownUser?.profileImage;

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > (pagination.pages || 1)) return;
    loadReferrals(nextPage);
  };

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/referrals")}
            className="mt-1 flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
            aria-label="Back to referrals"
          >
            <Icon icon="heroicons:arrow-left" className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Referral Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign-ups and invite links for this user
            </p>
          </div>
        </div>
        <Button
          text="Back to list"
          className="rounded-none bg-slate-700 text-white"
          onClick={() => router.push("/referrals")}
          icon="heroicons:list-bullet"
        />
      </div>

      {headerLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FinanceStatCard
              label="Sign-ups"
              value={total}
              icon="heroicons:user-plus"
              accent="primary"
            />
            <FinanceStatCard
              label="Referral code"
              value={code || "—"}
              icon="heroicons:ticket"
              accent="info"
            />
            <FinanceStatCard
              label="Page"
              value={`${pagination.current_page || page} / ${
                pagination.pages || 1
              }`}
              subValue={`${pagination.per_page || PER_PAGE} per page`}
              icon="heroicons:document-text"
              accent="success"
            />
            <FinanceStatCard
              label="User ID"
              value={userId}
              icon="heroicons:hashtag"
              accent="warning"
            />
          </div>

          <div className="border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-500/15 text-primary-500">
                {displayImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon icon="heroicons:user" className="text-3xl" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {displayName}
                </h2>
                <p className="text-sm text-slate-500">{displayEmail}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Code:{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
                    {code || "—"}
                  </code>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={registerLink}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <Button
                  text="Copy Link"
                  className="shrink-0 rounded-none bg-primary-500 text-white"
                  onClick={() => copy("Invite link", registerLink)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={appLink}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <Button
                  text="Copy App"
                  className="shrink-0 rounded-none bg-slate-700 text-white"
                  onClick={() => copy("App invite", appLink)}
                />
              </div>
            </div>
          </div>

          <GlassCard
            title={`Referred users (${pagination.total ?? referrals.length})`}
            subtitle="People who signed up using this referral link"
            bodyClass="overflow-hidden p-0"
          >
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading && referrals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                      </td>
                    </tr>
                  ) : referrals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm text-slate-500"
                      >
                        No sign-ups from this referral link yet.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((ref) => (
                      <tr
                        key={ref.id}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                              {ref.profileImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={ref.profileImage}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Icon
                                  icon="heroicons:user"
                                  className="text-slate-400"
                                />
                              )}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-white">
                              {ref.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                          {ref.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {ref.userType}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {ref.joinDate
                            ? new Date(ref.joinDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded bg-success-500/10 px-2 py-0.5 text-xs font-medium capitalize text-success-600">
                            {ref.status || "active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {listLoading && referrals.length > 0 ? (
              <div className="flex justify-center border-t border-slate-200 py-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : null}

            <PaginationBar
              currentPage={page}
              totalPages={pagination.pages || 1}
              onPageChange={handlePageChange}
              isLoading={listLoading}
            />
          </GlassCard>
        </>
      )}
    </div>
  );
};

export default ReferralUserDetailsPage;
