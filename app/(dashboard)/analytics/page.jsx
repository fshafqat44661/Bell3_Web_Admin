"use client";
import React, {useEffect, useState} from "react";
import Card from "@/components/ui/Card";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import axios from 'axios';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {

    // Function to fetch analytics data from the API
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/dashboard`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch analytics data");
        }

        const {data} = await response

        setAnalyticsData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the function to fetch analytics data
    fetchAnalyticsData();

  }, []);

  return (
    <div>
      <div className="grid grid-cols-12 gap-5 mb-5">

        <div className="col-span-12">
          <Card bodyClass="p-4">
            <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
              <GroupChart1 data ={analyticsData}/>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
