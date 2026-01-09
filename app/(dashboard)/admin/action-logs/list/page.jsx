"use client";
import React, {useEffect, useState} from "react";
import ActionLogsTable from "@/components/admin/ActionLogsTable";

const ActionLogsPage = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastpage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = React.useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            let url = `${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/action-logs/list?page=${page}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success && responseData.actionLogs) {
                    const { data, current_page, last_page, total } = responseData.actionLogs;
                    setData(data || []);
                    setCurrentPage(Number(current_page || 1));
                    setLastpage(last_page || 1);
                    setTotal(total || 0);
                } else {
                    setData([]);
                }
            } else {
                console.error('Failed to fetch action logs');
                setData([]);
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch data when page changes
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (isLoading || page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                            Action Logs
                        </h2>
                    </div>
                </div>

                {/* Table */}
                <ActionLogsTable 
                    total={total} 
                    responseData={data} 
                    isLoading={isLoading}
                    currentPage={currentPage}
                />
                
                {/* Pagination */}
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
                )}
            </div>
        </div>
    );
};

export default ActionLogsPage;
