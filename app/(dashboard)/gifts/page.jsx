"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FinanceStatCard from "@/components/finance/FinanceStatCard";
import GiftsTable from "@/components/finance/GiftsTable";
import GiftForm from "@/components/finance/GiftForm";
import { giftService } from "@/services/giftService";
import { formatCoins } from "@/components/finance/financeUtils";

const GiftsPage = () => {
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deletingGift, setDeletingGift] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchGifts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await giftService.getGifts();
      setGifts(res.data || res);
    } catch {
      toast.error("Failed to load gifts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  const handleCreate = () => {
    setEditingGift(null);
    setShowModal(true);
  };

  const handleEdit = (gift) => {
    setEditingGift(gift);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);
      if (editingGift) {
        await giftService.updateGift(editingGift.id, {
          ...data,
          is_active: editingGift.is_active,
        });
        toast.success("Gift updated successfully");
      } else {
        await giftService.createGift({ ...data, is_active: true });
        toast.success("Gift created successfully");
      }
      setShowModal(false);
      fetchGifts();
    } catch (error) {
      const fieldError = error?.data?.errors?.coin_cost?.[0];
      toast.error(fieldError || error?.data?.message || "Failed to save gift");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (gift) => {
    try {
      setToggleLoadingId(gift.id);
      await giftService.toggleGift(gift);
      toast.success(gift.is_active ? "Gift disabled" : "Gift enabled");
      fetchGifts();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update gift status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleDeleteClick = (gift) => {
    setDeletingGift(gift);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGift) return;

    try {
      setDeleteLoadingId(deletingGift.id);
      const res = await giftService.deleteGift(deletingGift);
      const message = (res?.message || "").toLowerCase();

      if (message.includes("deleted")) {
        toast.success(res.message || "Gift deleted successfully");
        setDeleteModal(false);
        setDeletingGift(null);
        fetchGifts();
      } else {
        toast.error(
          res?.message
            ? `Server responded: "${res.message}" — gift was not deleted. Backend delete route needs fixing.`
            : "Gift was not deleted. Backend delete route needs fixing."
        );
        fetchGifts();
      }
    } catch (error) {
      const firstFieldError = error?.data?.errors
        ? Object.values(error.data.errors)[0]?.[0]
        : null;
      toast.error(firstFieldError || error?.data?.message || "Failed to delete gift");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const activeCount = gifts.filter((g) => g.is_active).length;
  const cheapest = gifts.length
    ? Math.min(...gifts.map((g) => g.coins))
    : 0;
  const priciest = gifts.length
    ? Math.max(...gifts.map((g) => g.coins))
    : 0;

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gift Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage gifts users send to creators — each gift has a coin cost
          </p>
        </div>
        <Button
          text="Create Gift"
          className="rounded-none bg-slate-700 text-white"
          onClick={handleCreate}
          icon="heroicons:plus-circle"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          label="Total Gifts"
          value={gifts.length}
          icon="heroicons:gift"
          accent="primary"
        />
        <FinanceStatCard
          label="Active Gifts"
          value={activeCount}
          icon="heroicons:check-badge"
          accent="success"
        />
        <FinanceStatCard
          label="Cheapest Gift"
          value={gifts.length ? `${formatCoins(cheapest)} coins` : "—"}
          subValue="Lowest coin cost"
          icon="heroicons:arrow-trending-down"
          accent="info"
        />
        <FinanceStatCard
          label="Premium Gift"
          value={gifts.length ? `${formatCoins(priciest)} coins` : "—"}
          subValue="Highest coin cost"
          icon="heroicons:arrow-trending-up"
          accent="warning"
        />
      </div>

      <GiftsTable
        gifts={gifts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={handleDeleteClick}
        toggleLoadingId={toggleLoadingId}
        deleteLoadingId={deleteLoadingId}
      />

      <Modal
        activeModal={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeletingGift(null);
        }}
        title="Delete Gift"
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
                setDeletingGift(null);
              }}
            />
            <Button
              text="Delete"
              className="rounded-none bg-danger-500 text-white"
              isLoading={deleteLoadingId === deletingGift?.id}
              onClick={handleDeleteConfirm}
            />
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{" "}
          <strong>{deletingGift?.name}</strong> ({formatCoins(deletingGift?.coins)}{" "}
          coins)? This cannot be undone.
        </p>
      </Modal>

      <Modal
        activeModal={showModal}
        onClose={() => setShowModal(false)}
        title={editingGift ? "Update Gift" : "Create Gift"}
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
              text={editingGift ? "Update Gift" : "Create Gift"}
              type="submit"
              form="gift-form"
              className="rounded-none bg-slate-700 text-white"
              isLoading={formLoading}
            />
          </>
        }
      >
        <GiftForm
          key={editingGift?.id ?? "new"}
          initialData={editingGift}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default GiftsPage;
