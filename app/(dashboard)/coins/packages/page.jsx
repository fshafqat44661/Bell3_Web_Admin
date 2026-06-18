"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import CoinPackagesTable from "@/components/finance/CoinPackagesTable";
import CoinPackageForm from "@/components/finance/CoinPackageForm";
import CoinRateCard from "@/components/finance/CoinRateCard";
import CoinRateModal from "@/components/finance/CoinRateModal";
import { financeApi } from "@/services/financeApi";
import { walletSettingsApi } from "@/services/walletSettingsApi";
import { formatUsd } from "@/components/finance/financeUtils";

const DEFAULT_COINS_PER_DOLLAR = 10;

const CoinPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const [coinRateSetting, setCoinRateSetting] = useState(null);
  const [coinsPerDollar, setCoinsPerDollar] = useState(DEFAULT_COINS_PER_DOLLAR);
  const [rateLoading, setRateLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [rateSaving, setRateSaving] = useState(false);

  const fetchCoinRate = useCallback(async () => {
    try {
      setRateLoading(true);
      const setting = await walletSettingsApi.getCoinPerDollar();
      setCoinRateSetting(setting);
      if (setting?.value) {
        setCoinsPerDollar(Number(setting.value));
      }
    } catch {
      toast.error("Failed to load coin rate setting");
    } finally {
      setRateLoading(false);
    }
  }, []);

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
    fetchCoinRate();
    fetchPackages();
  }, [fetchCoinRate, fetchPackages]);

  const handleCreate = () => {
    if (!coinRateSetting) {
      toast.info("Please set up the base coin rate first");
      setShowRateModal(true);
      return;
    }
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

  const handleSaveRate = async (value) => {
    try {
      setRateSaving(true);
      const res = await walletSettingsApi.saveCoinPerDollar(value, coinRateSetting);
      const saved = res?.data;
      setCoinRateSetting(saved);
      setCoinsPerDollar(Number(saved?.value ?? value));
      toast.success(
        coinRateSetting
          ? "Coin rate updated successfully"
          : "Coin rate created successfully"
      );
      setShowRateModal(false);
    } catch (error) {
      const message =
        error?.data?.message ||
        (error?.status === 422
          ? "Rate already exists — use update instead"
          : "Failed to save coin rate");
      toast.error(message);
    } finally {
      setRateSaving(false);
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
            Set the base rate and manage Stripe coin packages for users & creators
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            text={coinRateSetting ? "Update Base Rate" : "Set Up Base Rate"}
            className="bg-warning-500 text-white"
            onClick={() => setShowRateModal(true)}
            icon="heroicons:currency-dollar"
          />
          <Button
            text="Create Package"
            className="bg-primary-500 text-white"
            onClick={handleCreate}
            icon="heroicons:plus-circle"
          />
        </div>
      </div>

      <CoinRateCard
        setting={coinRateSetting}
        coinsPerDollar={coinsPerDollar}
        isLoading={rateLoading}
        onConfigure={() => setShowRateModal(true)}
      />

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
          value={`${coinsPerDollar} coins / $1`}
          subValue={
            coinRateSetting ? "Loaded from API" : "Using default until configured"
          }
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
        coinsPerDollar={coinsPerDollar}
      />

      <Modal
        activeModal={showRateModal}
        onClose={() => setShowRateModal(false)}
        title={coinRateSetting ? "Update Coin Rate" : "Set Up Coin Rate"}
        className="max-w-lg"
        themeClass="bg-warning-500 dark:bg-warning-500"
      >
        <CoinRateModal
          setting={coinRateSetting}
          onSave={handleSaveRate}
          onClose={() => setShowRateModal(false)}
          isLoading={rateSaving}
        />
      </Modal>

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
          coinsPerDollar={coinsPerDollar}
        />
      </Modal>
    </div>
  );
};

export default CoinPackagesPage;
