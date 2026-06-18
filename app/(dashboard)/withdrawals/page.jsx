"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import WithdrawalsTable from "@/components/finance/WithdrawalsTable";
import WithdrawalReviewModal from "@/components/finance/WithdrawalReviewModal";
import PaginationBar, { paginate } from "@/components/finance/PaginationBar";
import { financeApi } from "@/services/financeApi";
import { formatUsd } from "@/components/finance/financeUtils";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const WithdrawalsPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [withdrawals, setWithdrawals] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewing, setReviewing] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await financeApi.getWithdrawals();
      const data = res.data || res;
      setAllWithdrawals(data);

      const filters =
        activeTab === "all" ? data : data.filter((w) => w.status === activeTab);
      setWithdrawals(filters);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load withdrawals");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleReview = async (status, remarks) => {
    if (!reviewing) return;
    if (status === "rejected" && !remarks.trim()) {
      toast.warning("Please add remarks when rejecting a withdrawal");
      return;
    }

    try {
      setReviewLoading(true);
      await financeApi.reviewWithdrawal(reviewing.id, {
        status,
        admin_remarks: remarks || null,
      });
      toast.success(
        status === "approved"
          ? "Withdrawal approved — coins sent to user"
          : "Withdrawal rejected"
      );
      setReviewing(null);
      fetchWithdrawals();
    } catch {
      toast.error("Failed to process withdrawal");
    } finally {
      setReviewLoading(false);
    }
  };

  const pendingCount = allWithdrawals.filter((w) => w.status === "pending").length;
  const pendingUsd = allWithdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount_usd, 0);
  const approvedCount = allWithdrawals.filter((w) => w.status === "approved").length;
  const rejectedCount = allWithdrawals.filter((w) => w.status === "rejected").length;

  const { data: pageData, meta } = paginate(withdrawals, currentPage, 8);

  const tabsWithCounts = TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === "all"
        ? allWithdrawals.length
        : allWithdrawals.filter((w) => w.status === tab.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Withdrawal Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review pending requests, approve payouts, or reject with admin remarks
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Pending Requests"
          value={pendingCount}
          subValue={formatUsd(pendingUsd) + " pending"}
          icon="heroicons:clock"
          accent="warning"
        />
        <FinanceStatCard
          label="Approved"
          value={approvedCount}
          icon="heroicons:check-circle"
          accent="success"
        />
        <FinanceStatCard
          label="Rejected"
          value={rejectedCount}
          icon="heroicons:x-circle"
          accent="danger"
        />
        <FinanceStatCard
          label="Total Processed"
          value={approvedCount + rejectedCount}
          icon="heroicons:document-check"
          accent="primary"
        />
      </div>

      <FinanceTabs
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <WithdrawalsTable
        withdrawals={pageData}
        isLoading={isLoading}
        onReview={setReviewing}
        showActions={activeTab === "pending" || activeTab === "all"}
      />

      <PaginationBar
        currentPage={meta.current_page}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      <Modal
        activeModal={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title="Review Withdrawal Request"
        className="max-w-lg"
      >
        <WithdrawalReviewModal
          withdrawal={reviewing}
          onApprove={(remarks) => handleReview("approved", remarks)}
          onReject={(remarks) => handleReview("rejected", remarks)}
          onClose={() => setReviewing(null)}
          isLoading={reviewLoading}
        />
      </Modal>
    </div>
  );
};

export default WithdrawalsPage;
