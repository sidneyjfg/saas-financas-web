import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../services/api";

// Registre os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get("/transactions/monthly");
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;
  }

  if (!reportData || reportData.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No data available.</p>;
  }

  // Prepara os dados do gráfico
  const chartData = {
    labels: [...new Set(reportData.map((item) => `${item.year}-${item.month}`))],
    datasets: [
      {
        label: "Income",
        data: reportData
          .filter((item) => item.type === "income")
          .map((item) => item.total),
        backgroundColor: "rgba(34, 197, 94, 0.7)", // Verde claro
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: reportData
          .filter((item) => item.type === "expense")
          .map((item) => item.total),
        backgroundColor: "rgba(239, 68, 68, 0.7)", // Vermelho claro
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            // Garante que o valor seja convertido para número antes de usar toFixed
            const value = Number(context.raw) || 0;
            return `${context.dataset.label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Financial Reports
      </h1>
      <div className="max-w-4xl mx-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
