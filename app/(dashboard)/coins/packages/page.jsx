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
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [coinRateSetting, setCoinRateSetting] = useState(null);
  const [coinsPerDollar, setCoinsPerDollar] = useState(DEFAULT_COINS_PER_DOLLAR);
  const [rateLoading, setRateLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [rateSaving, setRateSaving] = useState(false);
  const [showDeleteRateModal, setShowDeleteRateModal] = useState(false);
  const [rateDeleting, setRateDeleting] = useState(false);

  const fetchCoinRate = useCallback(async () => {
    try {
      setRateLoading(true);
      const setting = await walletSettingsApi.getCoinPerDollar();
      setCoinRateSetting(setting);
      if (setting?.value) {
        setCoinsPerDollar(Number(setting.value));
      } else {
        setCoinsPerDollar(DEFAULT_COINS_PER_DOLLAR);
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
      const res = await financeApi.getCoinPackages(coinsPerDollar);
      setPackages(res.data || res);
    } catch {
      toast.error("Failed to load coin packages");
    } finally {
      setIsLoading(false);
    }
  }, [coinsPerDollar]);

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
        await financeApi.updateCoinPackage(
          editingPackage.id,
          { ...data, is_active: editingPackage.is_active },
          coinsPerDollar
        );
        toast.success("Package updated successfully");
      } else {
        await financeApi.createCoinPackage(
          { ...data, is_active: true },
          coinsPerDollar
        );
        toast.success("Package created successfully");
      }
      setShowModal(false);
      fetchPackages();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save package");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (pkg) => {
    try {
      setToggleLoadingId(pkg.id);
      await financeApi.toggleCoinPackage(pkg, coinsPerDollar);
      toast.success(pkg.is_active ? "Package disabled" : "Package enabled");
      fetchPackages();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update package status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleDeleteClick = (pkg) => {
    setDeletingPackage(pkg);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPackage) return;

    try {
      setDeleteLoadingId(deletingPackage.id);
      await financeApi.deleteCoinPackage(deletingPackage.id);
      toast.success("Package deleted successfully");
      setDeleteModal(false);
      setDeletingPackage(null);
      fetchPackages();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete package");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleDeleteRateConfirm = async () => {
    try {
      setRateDeleting(true);
      await walletSettingsApi.deleteCoinPerDollar();
      setCoinRateSetting(null);
      setCoinsPerDollar(DEFAULT_COINS_PER_DOLLAR);
      setShowDeleteRateModal(false);
      toast.success("Coin rate deleted — you can set it up again");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete coin rate");
    } finally {
      setRateDeleting(false);
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
    .reduce(
      (sum, p) =>
        sum +
        (p.price_usd ??
          (coinsPerDollar > 0 ? Number((p.coins / coinsPerDollar).toFixed(2)) : 0)),
      0
    );

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
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
          {coinRateSetting && (
            <Button
              text="Delete Base Rate"
              className="bg-danger-500 text-white"
              onClick={() => setShowDeleteRateModal(true)}
              icon="heroicons:trash"
            />
          )}
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
        onDelete={() => setShowDeleteRateModal(true)}
        isDeleting={rateDeleting}
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
        onDelete={handleDeleteClick}
        toggleLoadingId={toggleLoadingId}
        deleteLoadingId={deleteLoadingId}
        coinsPerDollar={coinsPerDollar}
      />

      <Modal
        activeModal={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeletingPackage(null);
        }}
        title="Delete Package"
        className="max-w-md"
        centered
        fixedLayout
        footerContent={
          <>
            <Button
              text="Cancel"
              className="rounded-none bg-slate-200 text-slate-700"
              onClick={() => {
                setDeleteModal(false);
                setDeletingPackage(null);
              }}
            />
            <Button
              text="Delete"
              className="rounded-none bg-danger-500 text-white"
              isLoading={deleteLoadingId === deletingPackage?.id}
              onClick={handleDeleteConfirm}
            />
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{" "}
          <strong>{deletingPackage?.name}</strong>? This cannot be undone.
        </p>
      </Modal>

      <Modal
        activeModal={showDeleteRateModal}
        onClose={() => setShowDeleteRateModal(false)}
        title="Delete Coin Rate"
        className="max-w-md"
        centered
        fixedLayout
        footerContent={
          <>
            <Button
              text="Cancel"
              className="rounded-none bg-slate-200 text-slate-700"
              onClick={() => setShowDeleteRateModal(false)}
            />
            <Button
              text="Delete Rate"
              className="rounded-none bg-danger-500 text-white"
              isLoading={rateDeleting}
              onClick={handleDeleteRateConfirm}
            />
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Delete the base rate of{" "}
          <strong>{coinsPerDollar} coins per $1</strong>? New packages cannot be
          created until you set up the rate again.
        </p>
      </Modal>

      <Modal
        activeModal={showRateModal}
        onClose={() => setShowRateModal(false)}
        title={coinRateSetting ? "Update Coin Rate" : "Set Up Coin Rate"}
        className="max-w-lg"
        centered
        fixedLayout
        footerContent={
          <>
            <Button
              text="Cancel"
              className="rounded-none bg-slate-200 text-slate-700"
              onClick={() => setShowRateModal(false)}
            />
            <Button
              text={coinRateSetting ? "Update Rate" : "Create Rate"}
              type="submit"
              form="coin-rate-form"
              className="rounded-none bg-slate-700 text-white"
              isLoading={rateSaving}
            />
          </>
        }
      >
        <CoinRateModal setting={coinRateSetting} onSave={handleSaveRate} />
      </Modal>

      <Modal
        activeModal={showModal}
        onClose={() => setShowModal(false)}
        title={editingPackage ? "Update Package Pricing" : "Create Coin Package"}
        className="max-w-lg"
        centered
        fixedLayout
        footerContent={
          <>
            <Button
              text="Cancel"
              className="rounded-none bg-slate-200 text-slate-700"
              onClick={() => setShowModal(false)}
            />
            <Button
              text={editingPackage ? "Update Package" : "Create Package"}
              type="submit"
              form="coin-package-form"
              className="rounded-none bg-slate-700 text-white"
              isLoading={formLoading}
            />
          </>
        }
      >
        <CoinPackageForm
          key={editingPackage?.id ?? "new"}
          initialData={editingPackage}
          onSubmit={handleSubmit}
          coinsPerDollar={coinsPerDollar}
          coinRateSetting={coinRateSetting}
        />
      </Modal>
    </div>
  );
};

export default CoinPackagesPage;
