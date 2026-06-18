"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import CreatorsFinanceTable from "@/components/finance/CreatorsFinanceTable";
import { financeApi } from "@/services/financeApi";
import { formatUsd } from "@/components/finance/financeUtils";

const CreatorsFinancePage = () => {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");

  const fetchCreators = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await financeApi.getCreators();
      setCreators(res.data || res);
    } catch {
      toast.error("Failed to load creators");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  const handleToggleSuspension = (creator) => {
    if (creator.is_suspended) {
      confirmUnsuspend(creator);
    } else {
      setSuspendModal(creator);
      setSuspendReason("");
    }
  };

  const confirmUnsuspend = async (creator) => {
    try {
      setActionLoadingId(creator.id);
      await financeApi.toggleCreatorSuspension(creator.id, {
        is_suspended: false,
        suspension_reason: null,
      });
      toast.success(`${creator.name} has been unsuspended`);
      fetchCreators();
    } catch {
      toast.error("Failed to unsuspend creator");
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmSuspend = async () => {
    if (!suspendModal) return;
    if (!suspendReason.trim()) {
      toast.warning("Please provide a suspension reason");
      return;
    }

    try {
      setActionLoadingId(suspendModal.id);
      await financeApi.toggleCreatorSuspension(suspendModal.id, {
        is_suspended: true,
        suspension_reason: suspendReason,
      });
      toast.success(`${suspendModal.name} has been suspended`);
      setSuspendModal(null);
      fetchCreators();
    } catch {
      toast.error("Failed to suspend creator");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalEarnings = creators.reduce((sum, c) => sum + c.total_earnings_usd, 0);
  const pendingTotal = creators.reduce(
    (sum, c) => sum + c.pending_withdrawal_usd,
    0
  );
  const suspendedCount = creators.filter((c) => c.is_suspended).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Creator Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Earnings overview and suspension controls for creators
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Total Creators"
          value={creators.length}
          icon="heroicons:user-group"
          accent="primary"
        />
        <FinanceStatCard
          label="Total Earnings"
          value={formatUsd(totalEarnings)}
          icon="heroicons:banknotes"
          accent="success"
        />
        <FinanceStatCard
          label="Pending Withdrawals"
          value={formatUsd(pendingTotal)}
          icon="heroicons:clock"
          accent="warning"
        />
        <FinanceStatCard
          label="Suspended"
          value={suspendedCount}
          icon="heroicons:no-symbol"
          accent="danger"
        />
      </div>

      <CreatorsFinanceTable
        creators={creators}
        isLoading={isLoading}
        onToggleSuspension={handleToggleSuspension}
        actionLoadingId={actionLoadingId}
      />

      <Modal
        activeModal={Boolean(suspendModal)}
        onClose={() => setSuspendModal(null)}
        title="Suspend Creator"
        className="max-w-md"
      >
        {suspendModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Suspend <strong>{suspendModal.name}</strong>? They will not be able
              to receive gifts or withdraw coins.
            </p>
            <Textinput
              label="Suspension Reason"
              placeholder="e.g. Policy violation"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button
                text="Cancel"
                className="bg-slate-200 text-slate-700"
                onClick={() => setSuspendModal(null)}
              />
              <Button
                text="Confirm Suspend"
                className="bg-danger-500 text-white"
                isLoading={actionLoadingId === suspendModal.id}
                onClick={confirmSuspend}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreatorsFinancePage;
