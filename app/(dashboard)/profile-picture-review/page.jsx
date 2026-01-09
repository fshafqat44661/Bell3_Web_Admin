"use client";
import React, {useEffect, useState} from "react";
import ProfilePictureReviewTable from "@/components/admin/ProfilePictureReviewTable";

const ProfilePictureReviewPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            // Dummy data for demonstration
            const dummyData = [
                {
                    id: 1,
                    user: {
                        first_name: "John",
                        last_name: "Doe",
                        email: "john.doe@example.com",
                        profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    },
                    file_path: "https://api.dicebear.com/7.x/pixel-art/svg?seed=JohnSubmission", // Changed from image_url to file_path
                    status: "pending",
                    created_at: "2023-12-30 10:00:00"
                },
                {
                    id: 2,
                    user: {
                        first_name: "Jane",
                        last_name: "Smith",
                        email: "jane.smith@example.com",
                        profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
                    },
                    file_path: "https://api.dicebear.com/7.x/pixel-art/svg?seed=JaneSubmission", // Changed from image_url to file_path
                    status: "pending",
                    created_at: "2023-12-30 11:30:00"
                }
            ];

            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/profile-pictures/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData.data.data || []);
            } else {
                console.warn('API fetch failed, using dummy data for demonstration');
                setData(dummyData);
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
            // Fallback to dummy data on error as well for demonstration
            const dummyData = [
                {
                    id: 1,
                    user: {
                        first_name: "John",
                        last_name: "Doe",
                        email: "john.doe@example.com",
                        profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    },
                    file_path: "https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=John",
                    status: "pending",
                    created_at: "2023-12-30 10:00:00"
                }
            ];
            setData(dummyData);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    Profile Picture Approval
                </h2>
            </div>

            <ProfilePictureReviewTable 
                responseData={data} 
                fetchData={fetchData} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default ProfilePictureReviewPage;
