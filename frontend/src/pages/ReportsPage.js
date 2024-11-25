import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PremiumReports from "../components/PremiumReports";
import BasicReports from "../components/BasicReports";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportsPage = () => {
    const { userPlan } = useAuth();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userPlan) {
            console.log("No user plan found. Redirecting...");
            navigate("/signin");
        }
    }, [userPlan, navigate]);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const endpoint = userPlan === "Basic" ? "/transactions/monthly" : "/transactions/premium/summary";
                const response = await api.get(endpoint);
                console.log("Report data:", response.data);
                setReportData(response.data);
            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [userPlan]);

    const handleExportCSV = async () => {
        try {
            const endpoint = userPlan === "Basic" ? "/transactions/basic/export" : "/transactions/premium/export";
            const response = await api.get(endpoint, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transactions.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    if (loading) {
        return <p className="text-center mt-6 text-gray-500">Loading...</p>;
    }

    if (!reportData || reportData.length === 0) {
        return <p className="text-center mt-6 text-gray-500">No data available.</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
          <div className="w-full max-w-8xl bg-white rounded-lg shadow-lg p-6">
            {/* Exibe relatórios baseados no plano */}
            {userPlan === "Premium" ? (
              <PremiumReports data={reportData} />
            ) : (
              <BasicReports data={reportData} />
            )}
            <button
              onClick={handleExportCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md transition duration-200"
            >
              Export to CSV
            </button>
          </div>
        </div>
      );
      
};
