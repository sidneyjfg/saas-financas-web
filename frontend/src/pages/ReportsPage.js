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

// Registre os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportsPage = () => {
  const { userPlan } = useAuth(); // Pega o plano do usuário do contexto
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPlan) {
      console.log("No user plan found. Redirecting...");
      navigate("/signin"); // Redireciona se o plano do usuário não existir
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

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;
  }

  if (!reportData || reportData.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No data available.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
        {userPlan === "Premium" ? (
          <PremiumReports data={reportData} />
        ) : (
          <BasicReports data={reportData} />
        )}
      </div>
    </div>
  );
};
