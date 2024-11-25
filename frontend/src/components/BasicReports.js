import React from "react";
import { Bar } from "react-chartjs-2";

const BasicReports = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No basic data available.</p>;
  }

  const labels = [...new Set(data.map((item) => `${item.year}-${item.month}`))];
  const datasets = [
    {
      label: "Income",
      data: data.filter((item) => item.type === "income").map((item) => item.total),
      backgroundColor: "rgba(34, 197, 94, 0.7)", // Verde claro
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Expenses",
      data: data.filter((item) => item.type === "expense").map((item) => item.total),
      backgroundColor: "rgba(239, 68, 68, 0.7)", // Vermelho claro
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 1,
    },
  ];

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${Number(context.raw).toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Basic Financial Reports
      </h1>
      <div className="max-w-4xl mx-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BasicReports;