"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import CoinPackagesTable from "@/components/finance/CoinPackagesTable";
import CoinPackageForm from "@/components/finance/CoinPackageForm";
import { financeApi } from "@/services/financeApi";
import { formatUsd } from "@/components/finance/financeUtils";

const CoinPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await financeApi.getCoinPackages();
      setPackages(res.data || res);
    } catch {
      toast.error("Failed to load coin packages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);
      if (editingPackage) {
        await financeApi.updateCoinPackage(editingPackage.id, data);
        toast.success("Package updated successfully");
      } else {
        await financeApi.createCoinPackage({ ...data, is_active: true });
        toast.success("Package created successfully");
      }
      setShowModal(false);
      fetchPackages();
    } catch {
      toast.error("Failed to save package");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (pkg) => {
    try {
      setToggleLoadingId(pkg.id);
      await financeApi.toggleCoinPackage(pkg.id, !pkg.is_active);
      toast.success(pkg.is_active ? "Package disabled" : "Package enabled");
      fetchPackages();
    } catch {
      toast.error("Failed to update package status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const activeCount = packages.filter((p) => p.is_active).length;
  const totalRevenue = packages
    .filter((p) => p.is_active)
    .reduce((sum, p) => sum + p.price_usd, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Coin Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage Stripe coin packages for users & creators
          </p>
        </div>
        <Button
          text="Create Package"
          className="bg-primary-500 text-white"
          onClick={handleCreate}
          icon="heroicons:plus-circle"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Total Packages"
          value={packages.length}
          icon="heroicons:rectangle-stack"
          accent="primary"
        />
        <FinanceStatCard
          label="Active Packages"
          value={activeCount}
          icon="heroicons:check-badge"
          accent="success"
        />
        <FinanceStatCard
          label="Base Rate"
          value="10 coins / $1"
          subValue="Standard conversion rate"
          icon="heroicons:currency-dollar"
          accent="warning"
        />
        <FinanceStatCard
          label="Package Value"
          value={formatUsd(totalRevenue)}
          subValue="Sum of active package prices"
          icon="heroicons:banknotes"
          accent="info"
        />
      </div>

      <CoinPackagesTable
        packages={packages}
        isLoading={isLoading}
        onEdit={handleEdit}
        onToggle={handleToggle}
        toggleLoadingId={toggleLoadingId}
      />

      <Modal
        activeModal={showModal}
        onClose={() => setShowModal(false)}
        title={editingPackage ? "Update Package Pricing" : "Create Coin Package"}
        className="max-w-lg"
      >
        <CoinPackageForm
          initialData={editingPackage}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default CoinPackagesPage;
