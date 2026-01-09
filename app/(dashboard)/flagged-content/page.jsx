"use client";
import React, {useEffect, useState} from 'react';
import ContentPostsTable from "@/components/admin/ContentPostsTable";
import FlaggedContentPostsTable from "@/components/admin/FlaggedContentPostsTable";

const Page = () => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            // Get the token from local storage or any other method you use to store it
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/flagged-content-posts?filter[status]=pending`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
            if (response.ok) {

                const responseData = await response.json();
                setData(responseData.data);
                // setMetadata(responseData.meta)
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    };


    useEffect(()=>{
        fetchData();
    },[])

    return (
        <div>
            <FlaggedContentPostsTable fetchData={fetchData} responseData={data} setTableData={setData} isLoading={false} />
        </div>
    );
};

export default Page;