import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

// Map para exibir os meses como nomes legíveis
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const BasicReports = ({ data, goalsData }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, totalGoal: 0 });
  console.log(goalsData);
  // Filtrar dados com base nos filtros aplicados
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesCategory = selectedCategory ? item.categoryName === selectedCategory : true;
      const matchesMonth = selectedMonth ? `${item.year}-${item.month}` === selectedMonth : true;
      return matchesCategory && matchesMonth;
    });
  }, [data, selectedCategory, selectedMonth]);

  useEffect(() => {
    const totalIncome = filteredData
      .filter((item) => {
        const isIncome = item.type === "income";
        const isNotGoal = !goalsData.some(
          (goal) => String(goal.category.categoryId) === String(item.categoryId)
        );
        return isIncome && isNotGoal;
      })
      .reduce((acc, item) => acc + parseFloat(item.total), 0);

    const totalExpense = filteredData
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + parseFloat(item.total), 0);

    const totalGoal = goalsData.reduce((acc, goal) => acc + parseFloat(goal.targetAmount), 0);

    setSummary({
      totalIncome,
      totalExpense,
      totalGoal,
    });
  }, [filteredData, goalsData]);



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
    animation: true, // Desabilita animações
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Income</h2>
          <p className="text-xl font-semibold">${summary.totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-xl font-semibold">${summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Goal</h2>
          <p className="text-xl font-semibold">
            {`$${summary.totalGoal.toFixed(2)}`}
          </p>
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
      <div className="flex justify-center items-center bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Categoria</th>
              <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Total de Despesas (%)</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => {
              const totalCategoryExpense = filteredData
                .filter((item) => item.categoryName === category && item.type === "expense")
                .reduce((acc, item) => acc + parseFloat(item.total), 0);

              const percentage = ((totalCategoryExpense / summary.totalExpense) * 100).toFixed(2);

              return (
                <tr
                  key={category}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-teal-100 transition-colors duration-200`}
                >
                  <td className="py-4 px-6 text-gray-700 text-sm font-medium">{category}</td>
                  <td className="py-4 px-6 text-gray-700 text-sm">
                    {isNaN(percentage) || summary.totalExpense === 0 ? "0.00%" : `${percentage}%`}
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
