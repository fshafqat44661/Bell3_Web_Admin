
"use client";
import React, {useEffect, useState} from "react";
import CompanyTable from "@/components/partials/table/company-table";
import ExampleTwo from "@/components/partials/table/ExampleTwo";
import ContentPostsTable from "@/components/admin/ContentPostsTable";



function ContentPosts(props) {
    const [data, setData] = useState({});
    const [metadata, setMetadata] = useState({});


    const fetchData = async () => {
        try {
            // Get the token from local storage or any other method you use to store it
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/contentposts`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
                setMetadata(responseData.meta)
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
            <ContentPostsTable fetchData={fetchData} responseData={data.data || []} setTableData={setData} isLoading={false} />
        </div>
    );
}



export default ContentPosts;