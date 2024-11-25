import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

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

    // Buscar Transações e Categorias
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
            if (!newTransaction.date || !newTransaction.amount || !newTransaction.category) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            if (editingTransaction) {
                // Atualizar transação existente
                console.log("Atualizando transação: ", newTransaction);
                await api.put(`/transactions/${editingTransaction.id}`, newTransaction);
            } else {
                // Criar nova transação
                console.log("Criar transação: ", newTransaction);
                await api.post("/transactions", {
                    ...newTransaction,
                    categoryId: newTransaction.category, // Use o id da categoria
                });
            }
            console.log("Saiu dos if");

            // Recarregar dados após salvar
            const response = await api.get("/transactions");
            setTransactions(response.data);

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
            console.error("Erro detalhes:", error.response?.data || error.message);
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
                                    {category.name} {/* O nome visível para o usuário */}
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
                <div className="bg-white shadow-lg rounded-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-teal-600 text-white">
                                <th className="py-2 px-4">Data</th>
                                <th className="py-2 px-4">Tipo</th>
                                <th className="py-2 px-4">Categoria</th>
                                <th className="py-2 px-4">Valor</th>
                                <th className="py-2 px-4">Descrição</th>
                                <th className="py-2 px-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b">
                                    <td className="py-2 px-4">{transaction.date}</td>
                                    <td className="py-2 px-4">{transaction.type}</td>
                                    <td className="py-2 px-4">{transaction.category?.name || 'Sem Categoria'}</td>
                                    <td className="py-2 px-4">R$ {transaction.amount}</td>
                                    <td className="py-2 px-4">{transaction.description}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => handleEditTransaction(transaction)}
                                            className="text-blue-600 hover:underline mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                            className="text-red-600 hover:underline"
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
