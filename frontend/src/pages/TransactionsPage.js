import React, { useState, useEffect } from "react";
import { showErrorToast, showInfoToast, showSuccessToast, showWarningToast } from "../utils/toast";
import { showConfirmDialog } from "../utils/confirmDialog";
import Dropdown from "../components/Dropdown"; // Importa o componente genérico
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
            showWarningToast("Nenhum arquivo selecionado.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            await api.post("/transactions/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showSuccessToast("Arquivo importado com sucesso!");

            // Atualizar transações após importação
            const transactionsResponse = await api.get("/transactions");
            setTransactions(transactionsResponse.data);
        } catch (error) {
            if (error.response?.data?.error === "Arquivo já foi importado.") {
                showWarningToast("Este arquivo já foi importado anteriormente.");
            } else {
                const errorMessage =
                    error.response?.data?.error || "Erro ao importar o arquivo.";
                showWarningToast(errorMessage);
            }
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
                setCategories(categoriesResponse.data);

                // Buscar transações
                const transactionsResponse = await api.get("/transactions");
                setTransactions(transactionsResponse.data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.error
                showErrorToast("Erro ao carregar dados: ", errorMessage);
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
                showWarningToast("Preencha todos os campos obrigatórios.");
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
                await api.put(`/transactions/${editingTransaction.id}`, transactionPayload);
                showSuccessToast("Transação atualizada com sucesso!");
            } else {
                // Criar nova transação
                await api.post("/transactions", transactionPayload);
                showSuccessToast("Transação criada com sucesso!");
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
            const errorMessage =
                error.response?.data?.error
            showErrorToast("Erro ao salvar transação. Verifique os dados e tente novamente.\n", errorMessage);
        }
    };



    const handleUpdateCategories = async () => {
        try {
            await api.put("/transactions/update-categories");

            // Dispara o reload para o contexto
            // Atualizar a lista de transações após a atualização
            const transactionsResponse = await api.get("/transactions");
            setTransactions(transactionsResponse.data);
            triggerReload(); // Aqui dispara a atualização global
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || "Erro ao atualizar as categorias.";
            showErrorToast(errorMessage);
        }
    };


    // Editar Transação
    const handleEditTransaction = (transaction) => {
        setNewTransaction({
            date: formatDate(transaction.date),
            type: transaction.type,
            category: transaction.category?.id || transaction.categoryId, // Usa o ID da categoria
            amount: transaction.amount,
            description: transaction.description,
        });
        setEditingTransaction(transaction);
    };

    // Remover Transação
    const handleDeleteTransaction = (id) => {
        showConfirmDialog({
            title: "Confirmar Exclusão",
            message: "Tem certeza que deseja excluir esta transação?",
            onConfirm: async () => {
                try {
                    await api.delete(`/transactions/${id}`);
                    setTransactions((prevTransactions) =>
                        prevTransactions.filter((transaction) => transaction.id !== id)
                    );
                    showSuccessToast("Transação removida com sucesso.");
                } catch (error) {
                    const errorMessage = error.response?.data?.error || "Erro desconhecido.";
                    showErrorToast(`Erro ao excluir transação: ${errorMessage}`);
                }
            },
            onCancel: () => {
                showInfoToast("Ação cancelada."); // Opcional
            },
        });
    };

    const handleCancelEdit = () => {
        setNewTransaction({
            date: "",
            type: "expense",
            category: "",
            amount: "",
            description: "",
        });
        setEditingTransaction(null);
        showInfoToast("Edição cancelada.");
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
                            <a href="/upgrade" className="text-teal-600 underline ml-1">
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
                        {/* Dropdown de Tipo */}
                        <Dropdown
                            options={[
                                { value: "expense", label: "Despesa" },
                                { value: "income", label: "Receita" },
                            ]}
                            value={newTransaction.type}
                            onChange={(type) => setNewTransaction({ ...newTransaction, type })}
                            placeholder="Selecione o Tipo"
                        />

                        {/* Dropdown de Categorias */}
                        <Dropdown
                            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                            value={newTransaction.category}
                            onChange={(categoryId) =>
                                setNewTransaction({ ...newTransaction, category: categoryId })
                            }
                            placeholder="Selecione uma Categoria"
                        />

                        {/* Input de Valor */}
                        <input
                            type="number"
                            className="border-gray-300 border rounded-lg p-2"
                            placeholder="Valor"
                            value={newTransaction.amount}
                            onChange={(e) =>
                                setNewTransaction({ ...newTransaction, amount: e.target.value })
                            }
                        />
                        

                        {/* Input de Data */}
                        <input
                            type="date"
                            className="border-gray-300 border rounded-lg p-2"
                            value={newTransaction.date}
                            onChange={(e) =>
                                setNewTransaction({ ...newTransaction, date: e.target.value })
                            }
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

                    {/* Botões de Ações */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleSaveTransaction}
                            className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300"
                        >
                            {editingTransaction ? "Atualizar" : "Adicionar"}
                        </button>
                        {editingTransaction && (
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex justify-between items-center mb-4">
                    <Dropdown
                        options={[
                            { value: "Todos", label: "Todos" },
                            { value: "expense", label: "Despesa" },
                            { value: "income", label: "Receita" },
                        ]}
                        value={filters.type}
                        onChange={(type) => setFilters({ ...filters, type })}
                        placeholder="Filtrar por Tipo"
                    />
                    <Dropdown
                        options={[
                            { value: "", label: "Todas as Categorias" },
                            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                        ]}
                        value={filters.category}
                        onChange={(categoryId) => setFilters({ ...filters, category: categoryId })}
                        placeholder="Filtrar por Categoria"
                    />
                </div>

                {/* Tabela de Transações */}
                <div className="flex justify-center items-center bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-teal-600 text-white">
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Tipo
                                </th>
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
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider">
                                    Ações
                                </th>
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
                                    <td className="py-4 px-6 text-gray-700 text-sm">{transaction.type}</td>
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
