"use client";
import React, {useEffect, useState} from "react";
import UsersTable from "@/components/admin/UsersTable";

const Page = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastpage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchData = React.useCallback(async (page = 1, searchQuery = "") => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            let url = `${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/users/all?page=${page}`;
            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData.data || []);
                setCurrentPage(Number(responseData.current_page));
                setLastpage(responseData.last_page);
                setTotal(responseData.total);
            } else {
                console.error('Failed to fetch data');
                setData([]);
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch data when page or search changes
    useEffect(() => {
        fetchData(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm) {
            setCurrentPage(1);
        }
    }, [debouncedSearchTerm]);

    const handlePageChange = (page) => {
        if (isLoading || page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setCurrentPage(1);
        }
    };

    return (
        <div>
            <div>
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                            Users Management
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-64 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Always show the table structure */}
                <UsersTable 
                    total={total} 
                    responseData={data} 
                    setTableData={setData}
                    isLoading={isLoading}
                    searchTerm={debouncedSearchTerm}
                    fetchData={fetchData}
                    currentPage={currentPage}
                />
                
                {/* Show pagination only when there's data */}
                {data && data.length > 0 && (
                    <>
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
                                Page {currentPage} of {lastPage}
                            </span>
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage || isLoading}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                    currentPage === lastPage || isLoading
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                        
                        {debouncedSearchTerm && (
                            <div className="text-center py-4 text-slate-600 dark:text-slate-400">
                                Found {total} results for "{debouncedSearchTerm}"
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;
