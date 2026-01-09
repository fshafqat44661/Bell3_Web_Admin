"use client";
import React, {useEffect, useState} from 'react';
import BadWordsTable from "@/components/admin/BadWordsTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import NewBadwordForm from "@/components/admin/Forms/NewBadwordForm";
import {toast} from "react-toastify";
import axios from 'axios'

const Page = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const [perPage, setPerPage] = useState(15); // Items per page
    const [isLoading, setIsLoading] = useState(false); // Loading stat
    const [showAddModal, setShowAddModal] = useState(false)
    const fetchData = async (page = 1) => {
        try {
            setIsLoading(true)
            // Get the token from local storage or any other method you use to store it
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/badwords?page=${page}&per_page=${perPage}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData.data);
                setCurrentPage(responseData.meta.current_page);
                setTotalPages(responseData.meta.last_page);
                setIsLoading(false)
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Assuming you store your token in localStorage

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/badwords/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            // Check for 204 No Content status
            if (response.status === 204) {
                toast.success('Badword deleted successfully!');

                // Remove the deleted word from the data state
                const updatedData = data.filter((word) => word.id !== id);
                console.log(updatedData)
                setData(updatedData);
            } else {
                toast.error('Failed to delete badword.');
            }
        } catch (error) {
            console.error('Error deleting badword:', error);
            toast.error('An error occurred while deleting the badword.');
        }
    };

    const renderAddForm = () => (
        <NewBadwordForm closeModal={()=>setShowAddModal(false)}/>
    )
    return (
        <div className="flex w-full flex-col">
            <Button
                onClick={() => setShowAddModal(true)}
                className="bg-black-500 text-white h-2/4 w-40 flex items-end justify-end mb-4"
                text="Add New Word"/>
            
            <BadWordsTable handleDelete={handleDelete} rows={data} isLoading={isLoading}/>
            
            {data && data.length > 0 && (
                <div className="flex items-center justify-center p-4 space-x-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            currentPage === 1 || isLoading
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            currentPage === totalPages || isLoading
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            <Modal children={renderAddForm()}
                   title="Add new Word" activeModal={showAddModal}
                   onClose={() => setShowAddModal(false)}/>
        </div>
    );
};

export default Page;