import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
//import { useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useTeam } from "../../contexts/TeamContext";

export const TransactionsTeamPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "income",
    date: new Date().toISOString().split("T")[0],
  });
  const location = useLocation();
  const teamFromState = location.state?.team; // Recupera o time do estado da navegação
  const { selectedTeam, setSelectedTeam } = useTeam();


  useEffect(() => {
    console.log("teamFromState, ", teamFromState);
    console.log("SelectedTeam, ", selectedTeam);
    setSelectedTeam(teamFromState);
  }, [selectedTeam, teamFromState, setSelectedTeam]);


  useEffect(() => {
    if (!selectedTeam) {
      console.log("Nenhum time selecionado.");
      return;
    }

    console.log("Carregando transações para o time:", selectedTeam);

    const fetchTransactions = async () => {
      try {
        const response = await api.get("/teams/transactions", {
          headers: {
            "X-Team-ID": selectedTeam.id,
          },
        });
        setTransactions(response.data.transactions);
        console.log("Transações carregadas:", response.data.transactions);
      } catch (error) {
        console.error("Erro ao carregar transações:", error.response?.data || error);
        showErrorToast("Erro ao carregar transações.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedTeam]);



  const addTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.date) {
      showErrorToast("Preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/teams/transactions", newTransaction, {
        headers: {
          "X-Team-ID": selectedTeam.id, // Envia o ID do time no cabeçalho
        },
      });
      showSuccessToast("Transação adicionada com sucesso!");
      setTransactions((prev) => [...prev, response.data]);
      setNewTransaction({ description: "", amount: "", type: "income", date: new Date().toISOString().split("T")[0] });
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      showErrorToast("Erro ao adicionar transação.");
    }
  };


  if (!selectedTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Nenhum time selecionado. Por favor, volte e selecione um time.</p>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-teal-600 animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-teal-600 mb-6 text-center">
        Transações do Time: {selectedTeam?.name}
      </h1>

      {/* Formulário de Nova Transação */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-bold mb-4 text-teal-600">Adicionar Nova Transação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, description: e.target.value })
            }
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="number"
            placeholder="Valor"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })
            }
            className="border rounded-lg p-2 w-full"
          />
          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            className="border rounded-lg p-2 w-full"
          >
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </select>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <button
          onClick={addTransaction}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-teal-700"
        >
          Adicionar Transação
        </button>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-teal-600 mb-4">Transações</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Nenhuma transação encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg shadow-sm border ${transaction.type === "income" ? "border-teal-500" : "border-red-500"
                  }`}
              >
                <p className="font-bold text-gray-700">{transaction.description}</p>
                <p>
                  Valor:{" "}
                  <span
                    className={`font-semibold ${transaction.type === "income" ? "text-teal-600" : "text-red-600"
                      }`}
                  >
                    R$ {transaction.amount}
                  </span>
                </p>
                <p>Data: {new Date(transaction.date).toLocaleDateString()}</p>
                <p>Tipo: {transaction.type === "income" ? "Entrada" : "Saída"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
