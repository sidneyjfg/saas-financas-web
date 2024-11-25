import React from "react";
import { Bar } from "react-chartjs-2";

// Mapeia os números do mês para os nomes dos meses
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PremiumReports = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No premium data available.</p>;
  }

  // Formata os labels do gráfico como `2024/Fev`
  const labels = [
    ...new Set(
      data.map((item) => `${item.year}/${monthNames[item.month - 1]}`)
    ),
  ];

  const datasets = [
    {
      label: "Income",
      data: data
        .filter((item) => item.type === "income")
        .map((item) => parseFloat(item.total)),
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Expenses",
      data: data
        .filter((item) => item.type === "expense")
        .map((item) => parseFloat(item.total)),
      backgroundColor: "rgba(239, 68, 68, 0.7)",
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 1,
    },
  ];

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw) || 0;
            return `${context.dataset.label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: { type: "category", title: { display: true, text: "Year/Month" } },
      y: { beginAtZero: true, title: { display: true, text: "Total ($)" } },
    },
  };

  // Calcula o total de despesas e as porcentagens por categoria
  const expenses = data.filter((item) => item.type === "expense");
  const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.total), 0);

  const categoryPercentages = expenses.reduce((acc, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = 0;
    }
    acc[item.categoryName] += parseFloat(item.total);
    return acc;
  }, {});

  // Converte os valores absolutos em porcentagens
  const categoryList = Object.entries(categoryPercentages).map(([category, total]) => ({
    category,
    percentage: ((total / totalExpenses) * 100).toFixed(2),
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Premium Financial Reports
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Bar data={chartData} options={options} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Category Breakdown</h2>
          <ul className="list-disc ml-6">
            {categoryList.map((item, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{item.category}:</span>{" "}
                {item.percentage}% of total expenses
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Detailed Summary</h2>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Year/Month</th>
              <th className="px-4 py-2 border border-gray-300">Category Name</th>
              <th className="px-4 py-2 border border-gray-300">Type</th>
              <th className="px-4 py-2 border border-gray-300">Description</th>
              <th className="px-4 py-2 border border-gray-300">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-300">
                  {`${item.year}/${monthNames[item.month - 1]}`}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.categoryName || "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.type || "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.description || "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  ${parseFloat(item.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremiumReports;
