"use client";
import React, { useState, useEffect } from 'react';
import CategoriesTable from "@/components/admin/CategoriesTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from '@iconify/react';

const Page = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchCategories = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BELL3_API_URL}ecommerce/manageCategories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true',
                }
            });
            const fetchedData = response.data?.categories || response.data?.data || response.data;
            if (Array.isArray(fetchedData)) {
                setData(fetchedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories", {
                position: "top-right",
                autoClose: 2000,
            });
            setData([]);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddClick = () => {
        setEditingCategory(null);
        setCategoryName("");
        setShowAddModal(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setShowAddModal(true);
    };

    const handleDeleteClick = (category) => {
        setDeletingCategory(category);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCategory) return;
        
        try {
            setDeleting(true);
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_BELL3_API_URL}ecommerce/categories/${deletingCategory.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'ngrok-skip-browser-warning': 'true',
                    }
                }
            );

            if (response.status === 200 || response.status === 204) {
                toast.success("Category deleted successfully", {
                    position: "top-right",
                    autoClose: 2000,
                });
                fetchCategories();
                setDeleteModal(false);
                setDeletingCategory(null);
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error(error.response?.data?.message || "Failed to delete category", {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (categoryName.trim() !== "") {
            try {
                setLoading(true);
                let response;
                
                if (editingCategory) {
                    // Update existing category
                    response = await axios.put(`${process.env.NEXT_PUBLIC_BELL3_API_URL}ecommerce/categories/${editingCategory.id}`, {
                        name: categoryName
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        }
                    });
                } else {
                    // Create new category
                    response = await axios.post(`${process.env.NEXT_PUBLIC_BELL3_API_URL}ecommerce/new_category`, {
                        name: categoryName
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        }
                    });
                }

                if (response.status === 201 || response.status === 200) {
                    toast.success(response.data.message || (editingCategory ? "Category updated successfully" : "Category added successfully"), {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    
                    fetchCategories();
                    setCategoryName("");
                    setShowAddModal(false);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || (editingCategory ? "Failed to update category" : "Failed to add category"), {
                    position: "top-right",
                    autoClose: 2000,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const renderAddForm = () => (
        <form onSubmit={handleSave} className="space-y-4" key={editingCategory ? `edit-${editingCategory.id}` : 'add-new'}>
            <Textinput 
                label="Category Name"
                type="text"
                placeholder="Enter category name"
                defaultValue={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
            />
            <div className="flex justify-end space-x-3 mt-4">
                <Button 
                    text="Cancel"
                    className="bg-slate-100 text-slate-900" 
                    onClick={() => {
                        setShowAddModal(false);
                        setEditingCategory(null);
                        setCategoryName("");
                    }}
                    disabled={loading}
                />
                <Button 
                    text={loading ? (editingCategory ? "Updating..." : "Saving...") : (editingCategory ? "Update" : "Save")}
                    type="submit"
                    className={`bg-slate-900 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                />
            </div>
        </form>
    );

    return (
        <div className="flex w-full flex-col">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={handleAddClick}
                    className="bg-black-500 text-white w-40 flex items-center justify-center p-2 rounded"
                    text="Add Category"
                />
            </div>
            
            {fetching ? (
                <div className="flex justify-center my-12">
                    <p className="text-slate-500">Loading categories...</p>
                </div>
            ) : (
                <CategoriesTable 
                    rows={data} 
                    handleDeleteClick={handleDeleteClick} 
                    handleEdit={handleEditClick} 
                />
            )}

            <Modal 
                title={editingCategory ? "Edit Category" : "Add New Category"} 
                activeModal={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setCategoryName("");
                }}
            >
                {renderAddForm()}
            </Modal>

            <Modal
                title="Confirm Deletion"
                activeModal={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <div className="text-center">
                    <div className="text-danger-500 mb-4 items-center flex justify-center text-4xl">
                        <Icon icon="heroicons-outline:exclamation" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
                        Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-3">
                        <Button 
                            text="Cancel"
                            className="bg-slate-100 text-slate-900" 
                            onClick={() => setDeleteModal(false)}
                            disabled={deleting}
                        />
                        <Button 
                            text={deleting ? "Deleting..." : "Delete"}
                            className={`bg-danger-500 text-white ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Page;
