import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

// Map para exibir os meses como nomes legíveis
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const BasicReports = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });

  // Filtrar dados com base nos filtros aplicados
  const filteredData = data.filter((item) => {
    const matchesCategory = selectedCategory ? item.categoryName === selectedCategory : true;
    const matchesMonth = selectedMonth ? `${item.year}-${item.month}` === selectedMonth : true;
    return matchesCategory && matchesMonth;
  });

  useEffect(() => {
    // Recalcula os totais de Income e Expense com base nos dados filtrados
    const totalIncome = filteredData
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + parseFloat(item.total), 0);

    const totalExpense = filteredData
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + parseFloat(item.total), 0);

    setSummary({ totalIncome, totalExpense });
  }, [filteredData]);

  const categories = [...new Set(data.map((item) => item.categoryName))];
  const months = [...new Set(
    data.map((item) => `${item.year}-${item.month}`)
  )].map((month) => ({
    raw: month,
    formatted: `${monthNames[parseInt(month.split("-")[1], 10) - 1]}/${month.split("-")[0]}`,
  }));

  const labels = [...new Set(filteredData.map((item) => `${item.year}-${item.month}`))]
    .map((label) => ({
      raw: label,
      formatted: `${monthNames[parseInt(label.split("-")[1], 10) - 1]}/${label.split("-")[0]}`,
    }));

  const datasets = [
    {
      label: "Income",
      data: filteredData.filter((item) => item.type === "income").map((item) => item.total),
      backgroundColor: "rgba(34, 197, 94, 0.7)", // Verde claro
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Expenses",
      data: filteredData.filter((item) => item.type === "expense").map((item) => item.total),
      backgroundColor: "rgba(239, 68, 68, 0.7)", // Vermelho claro
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 1,
    },
  ];

  const chartData = { labels: labels.map((l) => l.formatted), datasets };

  const options = {
    responsive: true,
    animation: false, // Desabilita animações
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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Basic Financial Reports</h1>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Income</h2>
          <p className="text-xl font-semibold">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-xl font-semibold">${summary.totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Filtro de Categorias */}
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Mês */}
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
            {months.map((month) => (
              <option key={month.raw} value={month.raw}>
                {month.formatted}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráfico */}
      <div className="max-w-4xl mx-auto">
        <Bar data={chartData} options={options} />
      </div>

      {/* Tabela de Categorias */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Category Summary</h2>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Category</th>
              <th className="px-4 py-2 border border-gray-300">Total Expense (%)</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const totalCategoryExpense = filteredData
                .filter((item) => item.categoryName === category && item.type === "expense")
                .reduce((acc, item) => acc + parseFloat(item.total), 0);

              const percentage = ((totalCategoryExpense / summary.totalExpense) * 100).toFixed(2);

              return (
                <tr key={category}>
                  <td className="px-4 py-2 border border-gray-300">{category}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {isNaN(percentage) ? "0.00%" : `${percentage}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicReports;
