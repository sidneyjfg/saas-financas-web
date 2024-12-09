import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useParams, useNavigate } from "react-router-dom";

export const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "income", // ou 'expense'
    date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/teams/${teamId}/transactions`);
        setTransactions(response.data.transactions);
        setSummary(response.data.summary);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        showErrorToast("Erro ao carregar transações.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [teamId]);

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.date) {
      showErrorToast("Preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post(`/teams/${teamId}/transactions`, newTransaction);
      setTransactions([...transactions, response.data]);
      setNewTransaction({
        description: "",
        amount: "",
        type: "income",
        date: "",
      });
      showSuccessToast("Transação adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      showErrorToast("Erro ao adicionar transação.");
    }
  };

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Transações da Equipe
      </h1>

      <button
        onClick={() => navigate("/team-management")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        Voltar
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Resumo</h2>
        <p>Total de Entradas: R$ {summary.totalIncome}</p>
        <p>Total de Saídas: R$ {summary.totalExpense}</p>
        <p>Saldo Atual: R$ {summary.currentBalance}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Adicionar Transação</h2>
        <input
          type="text"
          placeholder="Descrição"
          className="border rounded-lg p-2 w-full mb-4"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Valor"
          className="border rounded-lg p-2 w-full mb-4"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, amount: e.target.value })
          }
        />
        <select
          className="border rounded-lg p-2 w-full mb-4"
          value={newTransaction.type}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, type: e.target.value })
          }
        >
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
        <input
          type="date"
          className="border rounded-lg p-2 w-full mb-4"
          value={newTransaction.date}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, date: e.target.value })
          }
        />
        <button
          onClick={handleAddTransaction}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          Adicionar
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Lista de Transações</h2>
        {transactions.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`p-4 mb-4 rounded-lg shadow-md ${
                  transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p>
                  <strong>{transaction.description}</strong>
                </p>
                <p>Valor: R$ {transaction.amount}</p>
                <p>Data: {new Date(transaction.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
