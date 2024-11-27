import React, { useState, useEffect, useCallback } from "react";
import { useReport } from "../contexts/ReportContext"; // Importa o contexto de relatórios
import { Bar, Pie } from "react-chartjs-2";
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

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PremiumReports = ({ data: initialData, goalsData }) => {
  const { shouldReload, resetReload } = useReport(); // Usa o contexto de relatórios
  const [data, setData] = useState(initialData); // Localmente, mantém os dados
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, totalGoal: 0 });

  // Função para recarregar os dados
  const reloadReportData = useCallback(async () => {
    try {
      const response = await api.get("/transactions/premium/summary"); // Endpoint do relatório Premium
      setData(response.data); // Atualiza os dados localmente
    } catch (error) {
      console.error("Erro ao recarregar os dados do relatório:", error);
    }
  }, []);

  // Recarregar os dados ao detectar mudanças globais (através do contexto)
  useEffect(() => {
    if (shouldReload) {
      reloadReportData(); // Recarrega os dados no relatório premium
      resetReload(); // Reseta o estado de recarregamento no contexto
    }
  }, [shouldReload, reloadReportData, resetReload]);

  // Atualiza os dados filtrados quando os filtros mudam
  useEffect(() => {
    const newData = data.filter((item) => {
      const formattedMonth = `${item.year}/${monthNames[item.month - 1]}`;
      const matchesCategory = selectedCategory ? item.categoryName === selectedCategory : true;
      const matchesMonth = selectedMonth ? formattedMonth === selectedMonth : true;
      return matchesCategory && matchesMonth;
    });
    setFilteredData(newData);
    console.log("Dados filtrados:", newData); // Verifique os dados aqui
  }, [selectedCategory, selectedMonth, data]);


  // Atualiza o resumo de despesas e rendimentos
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
  
    const totalGoal = (goalsData || [])
      .reduce((sum, goal) => sum + parseFloat(goal.targetAmount || 0), 0);
      
    setSummary({ totalIncome, totalExpenses, totalGoal });
  }, [filteredData, goalsData]);
  
  

  const labels = [...new Set(data.map((item) => `${item.year}/${monthNames[item.month - 1]}`))];

  const incomeData = labels.map((label) => {
    return data
      .filter(
        (item) =>
          item.type === "income" &&
          !data.some(
            (goalItem) =>
              goalItem.type === "goal" &&
              goalItem.categoryId === item.categoryId
          ) &&
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
  
  // Dados para o gráfico de barras
  const datasets = [
    {
      label: "Income",
      data: incomeData,
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
    {
      label: "Expenses",
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
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Goal</h2>
          <p className="text-xl font-semibold">${summary.totalGoal.toFixed(2)}</p>
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
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md"> {/* Aumentei o tamanho máximo */}
            <Bar data={chartData} options={barOptions} />
          </div>
        </div>

        {/* Gráfico de pizza */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="max-w-md w-full"> {/* Ajustado para o mesmo tamanho */}
            <Pie data={categoryData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReports;
