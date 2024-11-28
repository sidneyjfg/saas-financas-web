import React, { useState, useEffect } from "react";
import { FiRefreshCcw } from "react-icons/fi"; // Biblioteca react-icons
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useReport } from "../contexts/ReportContext";
import { formatDate, formatCurrency } from "../utils/index"


export const TransactionsPage = () => {
    const { userPlan } = useAuth(); // Recupera o plano do usuário
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        date: "",
        type: "expense", // Padrão para "Despesa"
        category: "",
        amount: "",
        description: "",
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: "Todos", category: "" });
    const { triggerReload } = useReport();

    const handleFileUpload = async (event) => {
        const file = event.target?.files?.[0];
        if (!file) {
            alert("Nenhum arquivo selecionado.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("file", file);
            console.log(formData);
            const response = await api.post("/transactions/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            alert("Arquivo importado com sucesso!");
            console.log("Resposta do servidor:", response.data);
    
            // Atualizar transações após importação
            const transactionsResponse = await api.get("/transactions");
            setTransactions(transactionsResponse.data);
        } catch (error) {
            if (error.response?.data?.error === "Arquivo já foi importado.") {
                alert("Este arquivo já foi importado anteriormente.");
            } else {
                const errorMessage =
                    error.response?.data?.error || "Erro ao importar o arquivo.";
                alert(errorMessage);
            }
            console.error("Erro ao importar arquivo:", error);
        }
    };
    


    // Buscar Transações, Categorias e Metas
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Buscar categorias para o dropdown
                const categoryEndpoint =
                    userPlan === "Basic" ? "/categories/basic" : "/categories/premium";
                const categoriesResponse = await api.get(categoryEndpoint);
                console.log("Categorias Existentes: ", categoriesResponse.data);
                setCategories(categoriesResponse.data);

                // Buscar transações
                const transactionsResponse = await api.get("/transactions");
                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userPlan]);

    // Salvar ou Atualizar Transação
    const handleSaveTransaction = async () => {
        try {
            // Verificar se todos os campos obrigatórios estão preenchidos
            if (!newTransaction.date || !newTransaction.amount || !newTransaction.category) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }
    
            // Preparar os dados para envio
            const transactionPayload = {
                date: newTransaction.date,
                type: newTransaction.type || "expense",
                amount: parseFloat(newTransaction.amount), // Garantir que é número
                description: newTransaction.description || "",
                categoryId: newTransaction.category?.id || newTransaction.category
            };
    
            if (editingTransaction) {
                // Atualizar transação existente
                console.log("Atualizando transação: ", transactionPayload);
                await api.put(`/transactions/${editingTransaction.id}`, transactionPayload);
            } else {
                // Criar nova transação
                console.log("Criando nova transação: ", transactionPayload);
                await api.post("/transactions", transactionPayload);
                console.log("Criada");
            }
    
            // Recarregar dados após salvar
            const transactionsResponse = await api.get("/transactions");
            setTransactions(transactionsResponse.data);
    
            // Resetar o formulário
            setNewTransaction({
                date: "",
                type: "expense",
                category: "",
                amount: "",
                description: "",
            });
            setEditingTransaction(null);
        } catch (error) {
            console.error("Erro ao salvar transação:", error);
            alert("Erro ao salvar transação. Verifique os dados e tente novamente.");
        }
    };
    


    const handleUpdateCategories = async () => {
        try {
            const response = await api.put("/transactions/update-categories");
            alert("Categorias atualizadas com sucesso!");
            console.log("Resposta do servidor:", response.data);

            // Dispara o reload para o contexto
            // Atualizar a lista de transações após a atualização
            const transactionsResponse = await api.get("/transactions");
            setTransactions(transactionsResponse.data);
            triggerReload(); // Aqui dispara a atualização global
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || "Erro ao atualizar as categorias.";
            alert(errorMessage);
            console.error("Erro ao atualizar categorias:", error);
        }
    };


    // Editar Transação
    const handleEditTransaction = (transaction) => {
        setNewTransaction({
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
        });
        setEditingTransaction(transaction);
    };

    // Remover Transação
    const handleDeleteTransaction = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter((transaction) => transaction.id !== id));

            } catch (error) {
                console.error("Erro ao excluir transação:", error);
            }
        }
    };

    // Filtrar Transações
    const filteredTransactions = transactions.filter((transaction) => {
        return (
            (filters.type === "Todos" || transaction.type === filters.type) &&
            (!filters.category || transaction.category === filters.category)
        );
    });

    if (loading) {
        return <p className="text-center mt-6 text-gray-500">Carregando...</p>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">
                    Gerenciamento de Transações
                </h1>

                {/* Botão de Upload */}
                <div className="mt-4">
                    {userPlan !== "Premium" ? (
                        <p className="text-red-500">
                            A importação de arquivos está disponível apenas para usuários Premium.
                            <a
                                href="/upgrade"
                                className="text-teal-600 underline ml-1"
                            >
                                Atualize agora.
                            </a>
                        </p>
                    ) : (
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <span className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all cursor-pointer">
                                Importar CSV
                            </span>
                        </label>
                    )}
                </div>


                {/* Formulário de Transações */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-10">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                        {editingTransaction ? "Editar Transação" : "Nova Transação"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="date"
                            className="border-gray-300 border rounded-lg p-2"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        />
                        <select
                            className="border-gray-300 border rounded-lg p-2"
                            value={newTransaction.type}
                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </select>
                        <select
                            className="border-gray-300 border rounded-lg p-2"
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        >
                            <option value="">Selecione uma Categoria</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            className="border-gray-300 border rounded-lg p-2"
                            placeholder="Valor"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        />
                        <textarea
                            className="border-gray-300 border rounded-lg p-2"
                            placeholder="Descrição (opcional)"
                            value={newTransaction.description}
                            onChange={(e) =>
                                setNewTransaction({ ...newTransaction, description: e.target.value })
                            }
                        />
                    </div>
                    <button
                        onClick={handleSaveTransaction}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300"
                    >
                        {editingTransaction ? "Atualizar" : "Adicionar"}
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex justify-between items-center mb-4">
                    <select
                        className="border-gray-300 border rounded-lg p-2"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="Todos">Todos</option>
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                    </select>
                    <select
                        className="border-gray-300 border rounded-lg p-2"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">Todas as Categorias</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Tabela de Transações */}
                {/* Tabela de Transações */}
                <div className="flex justify-center items-center bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-teal-600 text-white">
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Data</th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Tipo</th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Categoria
                                    <button
                                        onClick={handleUpdateCategories}
                                        className="ml-2 text-white hover:text-gray-300 transition-all"
                                        title="Atualizar Categorias"
                                    >
                                        <FiRefreshCcw />
                                    </button>
                                </th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Valor</th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Descrição</th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction, index) => (
                                <tr
                                    key={transaction.id}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        } hover:bg-teal-100 transition-colors duration-200`}
                                >
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.type}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.category?.name || "Sem Categoria"}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        R$ {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.description.replace(
                                            /\d+(\.\d+)?/g,
                                            (match) => formatCurrency(Number(match))
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <button
                                            onClick={() => handleEditTransaction(transaction)}
                                            className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                            className="text-red-600 hover:text-red-800 font-semibold transition-all duration-200"
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
