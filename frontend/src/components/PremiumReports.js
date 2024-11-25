import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PremiumReports = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0 });

  // Atualiza os dados filtrados quando os filtros mudam
  useEffect(() => {
    const newData = data.filter((item) => {
      const formattedMonth = `${item.year}/${monthNames[item.month - 1]}`;
      const matchesCategory = selectedCategory ? item.categoryName === selectedCategory : true;
      const matchesMonth = selectedMonth ? formattedMonth === selectedMonth : true;
      return matchesCategory && matchesMonth;
    });
    setFilteredData(newData);
  }, [selectedCategory, selectedMonth, data]);

  // Atualiza o resumo de despesas e rendimentos
  useEffect(() => {
    const totalIncome = filteredData
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + parseFloat(item.total), 0);

    const totalExpenses = filteredData
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + parseFloat(item.total), 0);

    setSummary({ totalIncome, totalExpenses });
  }, [filteredData]);

  // Dados para o gráfico de barras
  const labels = [...new Set(filteredData.map((item) => `${item.year}/${monthNames[item.month - 1]}`))];
  const datasets = [
    {
      label: "Income",
      data: filteredData.filter((item) => item.type === "income").map((item) => parseFloat(item.total)),
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Expenses",
      data: filteredData.filter((item) => item.type === "expense").map((item) => parseFloat(item.total)),
      backgroundColor: "rgba(239, 68, 68, 0.7)",
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 1,
    },
  ];
  const chartData = { labels, datasets };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { type: "category", title: { display: true, text: "Year/Month" } },
      y: { beginAtZero: true, title: { display: true, text: "Total ($)" } },
    },
  };

  // Dados para o gráfico de pizza
  const categoryExpenses = filteredData.filter((item) => item.type === "expense");
  const totalExpenses = categoryExpenses.reduce((sum, item) => sum + parseFloat(item.total), 0);

  const categoryData = {
    labels: [...new Set(categoryExpenses.map((item) => item.categoryName))],
    datasets: [
      {
        data: [...new Set(categoryExpenses.map((item) => item.categoryName))]
          .map((category) => {
            const totalCategory = categoryExpenses
              .filter((item) => item.categoryName === category)
              .reduce((sum, item) => sum + parseFloat(item.total), 0);
            return ((totalCategory / totalExpenses) * 100).toFixed(2); // Porcentagem
          }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Premium Financial Reports</h1>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Income</h2>
          <p className="text-xl font-semibold">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-xl font-semibold">${summary.totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="categoryFilter" className="block text-gray-700 font-medium mb-2">
            Filter by Category
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          >
            <option value="">All Categories</option>
            {[...new Set(data.map((item) => item.categoryName))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="monthFilter" className="block text-gray-700 font-medium mb-2">
            Filter by Month
          </label>
          <select
            id="monthFilter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          >
            <option value="">All Months</option>
            {[...new Set(data.map((item) => `${item.year}/${monthNames[item.month - 1]}`))].map(
              (month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        {/* Gráfico de barras */}
        <div className="w-full lg:w-1/2">
          <Bar data={chartData} options={barOptions} />
        </div>

        {/* Gráfico de pizza */}
        <div className="w-full lg:w-1/2 max-w-lg mx-auto">
          <Pie data={categoryData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default PremiumReports;
