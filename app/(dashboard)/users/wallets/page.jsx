"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import UserWalletsTable from "@/components/finance/UserWalletsTable";
import WalletHistoryModal from "@/components/finance/WalletHistoryModal";
import PaginationBar, { paginate } from "@/components/finance/PaginationBar";
import { financeApi } from "@/services/financeApi";
import { formatCoins } from "@/components/finance/financeUtils";

const UserWalletsPage = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [historyUser, setHistoryUser] = useState(null);
  const [historyTx, setHistoryTx] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await financeApi.getUserWallets();
      setWallets(res.data || res);
    } catch {
      toast.error("Failed to load user wallets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleViewHistory = async (user) => {
    setHistoryUser(user);
    try {
      setHistoryLoading(true);
      const res = await financeApi.getUserTransactions(user.id);
      setHistoryTx(res.data || res);
    } catch {
      toast.error("Failed to load transaction history");
      setHistoryTx([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleStatus = async (wallet) => {
    const action = wallet.is_active ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this wallet?`)) {
      return;
    }

    try {
      setActionLoadingId(wallet.id);
      await financeApi.updateUserWalletStatus(wallet.id, {
        is_active: !wallet.is_active,
      });
      toast.success(`Wallet ${action}d successfully`);
      fetchWallets();
    } catch {
      toast.error(`Failed to ${action} wallet`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance_coins, 0);
  const activeWallets = wallets.filter((w) => w.is_active).length;
  const creators = wallets.filter((w) => w.role === "creator").length;

  const { data: pageData, meta } = paginate(wallets, currentPage, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          User Wallet Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Wallet overview, transaction history, and account actions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Total Wallets"
          value={wallets.length}
          icon="heroicons:wallet"
          accent="primary"
        />
        <FinanceStatCard
          label="Active Wallets"
          value={activeWallets}
          icon="heroicons:check-badge"
          accent="success"
        />
        <FinanceStatCard
          label="Total Coin Balance"
          value={formatCoins(totalBalance)}
          icon="heroicons:currency-dollar"
          accent="warning"
        />
        <FinanceStatCard
          label="Creator Wallets"
          value={creators}
          icon="heroicons:user-group"
          accent="info"
        />
      </div>

      <UserWalletsTable
        wallets={pageData}
        isLoading={isLoading}
        onViewHistory={handleViewHistory}
        onToggleStatus={handleToggleStatus}
        actionLoadingId={actionLoadingId}
      />

      <PaginationBar
        currentPage={meta.current_page}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      <Modal
        activeModal={Boolean(historyUser)}
        onClose={() => setHistoryUser(null)}
        title="Transaction History"
        className="max-w-lg"
        scrollContent
      >
        <WalletHistoryModal
          user={historyUser}
          transactions={historyTx}
          isLoading={historyLoading}
        />
      </Modal>
    </div>
  );
};

export default UserWalletsPage;
