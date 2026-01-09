"use client"
import React, {useEffect, useRef, useState} from 'react';
import AllFlaggedTable from "@/components/admin/AllFlaggedTable";
import Select from "@/components/ui/Select";

const Page = () => {
    const [flagStatus, setFlagStatus] = useState("")
    const [data, setData] = useState([])
    const [filterStatus, setSelectedFilterStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLoading, setDataLoading] = useState(false)

    // A ref to keep track of the last fetch request's query parameters
    const lastFetchRef = useRef({filterStatus: '', currentPage: 1});

    const tableColumns = [
        {
            label: "Content Id",
            field: "content_id",
        },
        {
            label: "Flag Predefined Reason",
            field: "flag_predefined_reason",
        },
        {
            label: "Custom Reason",
            field: "custom_reason",
        },
        {
            label: "Flag Status",
            field: "flag_status",
        },

        {
            label: "Content Title",
            field: "content_title",
        },
        {
            label: "Content",
            field: "content_body",
        },

        {
            label: "Creator Username",
            field: "creator_username"
        },
        {
            label: "Reported By",
            field: "reported_by"
        },
        {
            label: "Reviewed By",
            field: "reviewed_by"
        }
    ];

    const filterStatusOptions = [
        {value: "all", label: "All"},
        {value: "deleted", label: "Deleted"},
        {value: "ignored", label: "Ignored"}
    ];

    useEffect(() => {
        fetchData()
    }, [filterStatus, currentPage])


    useEffect(() => {
        // Check if the fetch should be made based on changes in state
        if (
            lastFetchRef.current.filterStatus !== filterStatus ||
            lastFetchRef.current.currentPage !== currentPage
        ) {
            fetchData();
        }
    }, [filterStatus, currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    const fetchData = async () => {
        try {
            setDataLoading(true)
            // Get the token from local storage or any other method you use to store it
            const token = localStorage.getItem('token');
            //the all filter should include only deleted + ignored content post's
            let url = `${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/flagged-content-posts?page=${currentPage}&filter[status]=deleted,ignored`;

            if (filterStatus !== "all" && filterStatus !== "") {
                url += `&filter[status]=${filterStatus}`;
            }

            // Update the last fetch ref to avoid unnecessary fetches
            lastFetchRef.current = {filterStatus, currentPage};

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (response.ok) {
                setDataLoading(false)
                const responseData = await response.json();
                setData(responseData.data);
                setTotalPages(responseData.meta.last_page);
            } else {
                setDataLoading(false)
                console.error('Failed to fetch data');
            }
        } catch (error) {
            setDataLoading(false)
            console.error('Error while fetching data:', error);
        }
    }


    return (

        <div className="flex flex-col gap-2">
            <div className="items-center justify-between mb-6 md:flex">
                <h4 className="card-title">Past Reviewed Flagged Posts</h4>
            </div>
            {dataLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                        <Select
                            placeholder="Status"
                            defaultValue={"all"}
                            value={filterStatus}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setSelectedFilterStatus(e.target.value)}
                            options={filterStatusOptions}
                        />

                    {data && data.length > 0 ? (
                        <>
                            <AllFlaggedTable rows={data} columns={tableColumns}/>
                            <div className="pagination flex items-center justify-center p-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                  Page {currentPage} of {totalPages}
                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No Flagged Post found, please check the filters</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Page;