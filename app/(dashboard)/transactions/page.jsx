"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import TransactionsTable from "@/components/finance/TransactionsTable";
import PaginationBar, { paginate } from "@/components/finance/PaginationBar";
import { financeApi } from "@/services/financeApi";
import { formatUsd } from "@/components/finance/financeUtils";

const TABS = [
  { id: "all", label: "All" },
  { id: "purchase", label: "Purchases" },
  { id: "gift", label: "Gifts" },
  { id: "withdrawal", label: "Withdrawals" },
];

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await financeApi.getTransactions();
      const data = res.data || res;
      setAllTransactions(data);
      const filtered =
        activeTab !== "all"
          ? data.filter((t) => t.type === activeTab)
          : data;
      setTransactions(filtered);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await financeApi.exportReport(activeTab);
      const data = res.data || res;
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bell3-transactions-${activeTab}-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported successfully");
    } catch {
      toast.error("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  const purchases = allTransactions.filter((t) => t.type === "purchase");
  const gifts = allTransactions.filter((t) => t.type === "gift");
  const withdrawals = allTransactions.filter((t) => t.type === "withdrawal");
  const revenue = purchases
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount_usd, 0);

  const { data: pageData, meta } = paginate(transactions, currentPage, 10);

  const tabsWithCounts = TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === "all"
        ? allTransactions.length
        : allTransactions.filter((t) => t.type === tab.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Transaction Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View purchases, gifts, and withdrawals across the platform
          </p>
        </div>
        <Button
          text="Export Report"
          className="bg-slate-800 text-white dark:bg-primary-500"
          onClick={handleExport}
          isLoading={exporting}
          icon="heroicons:arrow-down-tray"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Total Revenue"
          value={formatUsd(revenue)}
          icon="heroicons:banknotes"
          accent="success"
        />
        <FinanceStatCard
          label="Purchases"
          value={purchases.length}
          icon="heroicons:shopping-cart"
          accent="primary"
        />
        <FinanceStatCard
          label="Gifts Sent"
          value={gifts.length}
          icon="heroicons:gift"
          accent="warning"
        />
        <FinanceStatCard
          label="Withdrawals"
          value={withdrawals.length}
          icon="heroicons:arrow-up-tray"
          accent="danger"
        />
      </div>

      <FinanceTabs
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <TransactionsTable
        transactions={pageData}
        isLoading={isLoading}
        showType={activeTab === "all"}
      />

      <PaginationBar
        currentPage={meta.current_page}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionsPage;
