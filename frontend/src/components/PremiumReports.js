import React, { useState, useEffect, useCallback } from "react";
import { useReport } from "../contexts/ReportContext";
import { Bar, Pie } from "react-chartjs-2";
import { Dropdown } from "../components/Dropdown";
import { formatCurrency } from "../utils/formatCurrency";
import api from "../services/api";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PremiumReports = ({ data: initialData, goalsData }) => {
  const { shouldReload, resetReload } = useReport();
  const [data, setData] = useState(initialData);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, totalGoal: 0 });

  const reloadReportData = useCallback(async () => {
    try {
      const response = await api.get("/transactions/premium/summary");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao recarregar os dados do relatório:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldReload) {
      reloadReportData();
      resetReload();
    }
  }, [shouldReload, reloadReportData, resetReload]);

  useEffect(() => {
    const newData = data.filter((item) => {
      const formattedMonth = `${item.year}/${monthNames[item.month - 1]}`;
      const matchesCategory = selectedCategory ? item.categoryName === selectedCategory : true;
      const matchesMonth = selectedMonth ? formattedMonth === selectedMonth : true;
      return matchesCategory && matchesMonth;
    });
    setFilteredData(newData);
  }, [selectedCategory, selectedMonth, data]);

  useEffect(() => {
    const totalIncome = filteredData
      .filter((item) => {
        const isIncome = item.type === "income";
        const isNotGoal = !goalsData.some(
          (goal) => String(goal.category.id) === String(item.categoryId)
        );
        return isIncome && isNotGoal;
      })
      .reduce((sum, item) => sum + parseFloat(item.total), 0);

    const totalExpenses = filteredData
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + parseFloat(item.total), 0);

    const totalGoal = (goalsData || []).reduce(
      (sum, goal) => sum + parseFloat(goal.targetAmount || 0),
      0
    );

    setSummary({ totalIncome, totalExpenses, totalGoal });
  }, [filteredData, goalsData]);

  const labels = [...new Set(data.map((item) => `${item.year}/${monthNames[item.month - 1]}`))];
  const incomeData = labels.map((label) => {
    return data
      .filter(
        (item) =>
          item.type === "income" &&
          `${item.year}/${monthNames[item.month - 1]}` === label
      )
      .reduce((sum, item) => sum + parseFloat(item.total), 0);
  });

  const expenseData = labels.map((label) => {
    return data
      .filter(
        (item) =>
          item.type === "expense" &&
          `${item.year}/${monthNames[item.month - 1]}` === label
      )
      .reduce((sum, item) => sum + parseFloat(item.total), 0);
  });

  const datasets = [
    {
      label: "Receita",
      data: incomeData,
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Despesas",
      data: expenseData,
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

  const categoryExpenses = filteredData.filter((item) => item.type === "expense");
  const totalExpenses = categoryExpenses.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const categories = [...new Set(data.map((item) => item.categoryName))];

  const categoryLabels = [...new Set(categoryExpenses.map((item) => item.categoryName))];
  const categoryColors = categoryLabels.map((category) => {
    const categoryItem = categoryExpenses.find((item) => item.categoryName === category);
    return categoryItem?.categoryColor || "rgba(200, 200, 200, 0.7)";
  });

  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryLabels.map((category) => {
          const totalCategory = categoryExpenses
            .filter((item) => item.categoryName === category)
            .reduce((sum, item) => sum + parseFloat(item.total), 0);
          return ((totalCategory / totalExpenses) * 100).toFixed(2);
        }),
        backgroundColor: categoryColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Relatório de Gastos</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Receita</h2>
          <p className="text-xl font-semibold">{formatCurrency(summary.totalIncome.toFixed(2))}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Despesas</h2>
          <p className="text-xl font-semibold">{formatCurrency(summary.totalExpenses.toFixed(2))}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Metas</h2>
          <p className="text-xl font-semibold">{formatCurrency(summary.totalGoal.toFixed(2))}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Dropdown
          options={[
            { value: "", label: "Todas as categorias" },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          placeholder="Filtrar por categorias"
        />
        <Dropdown
          options={[
            { value: "", label: "Todos os meses" },
            ...labels.map((label) => ({ value: label, label })),
          ]}
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          placeholder="Filtro por Mês"
        />
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md">
            <Bar data={chartData} options={barOptions} />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="max-w-md w-full">
            <Pie data={categoryData} options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-center mb-4">Despesas por Categorias</h2>
        <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Categoria</th>
              <th className="py-3 px-4 text-left">Total de Despesas</th>
              <th className="py-3 px-4 text-left">Porcentagem</th>
            </tr>
          </thead>
          <tbody>
            {categoryLabels.map((category, index) => {
              const totalCategoryExpense = categoryExpenses
                .filter((item) => item.categoryName === category)
                .reduce((sum, item) => sum + parseFloat(item.total), 0);
              const percentage = ((totalCategoryExpense / totalExpenses) * 100).toFixed(2);

              return (
                <tr key={category} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="py-3 px-4">{category}</td>
                  <td className="py-3 px-4">{formatCurrency(totalCategoryExpense)}</td>
                  <td className="py-3 px-4">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremiumReports;
