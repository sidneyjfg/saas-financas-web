import React, { useState, useEffect } from "react";
import { showErrorToast, showInfoToast, showSuccessToast, showWarningToast } from "../utils/toast";
import { showConfirmDialog } from "../utils/confirmDialog";
import { Dropdown } from "../components/Dropdown"; // Importa o componente genérico
import { FiRefreshCcw } from "react-icons/fi"; // Biblioteca react-icons
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useReport } from "../contexts/ReportContext";
import { formatDate, formatCurrency } from "../utils/index"
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const TransactionsPage = () => {
    const { user } = useAuth(); // Recupera o plano do usuário
    const [transactions, setTransactions] = useState([]);
    const [selectedTransactions, setSelectedTransactions] = useState([]); // Armazena os IDs selecionados
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
    const [filters, setFilters] = useState({
        type: "Todos", category: "", searchQuery: "",
        month: "",
        year: "",
    });

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

    const handleDeleteAllTransactions = async () => {
        // Obtém o userId da primeira transação
        const userId = user.id;

        if (!userId) {
            showWarningToast("ID do usuário não foi encontrado.");
            return;
        }

        try {
            showConfirmDialog({
                title: "Confirmar Exclusão",
                message: "Tem certeza de que deseja excluir TODAS as transações juntamente com os arquivos importados?\nEsta ação não terá como voltar.",
                onConfirm: async () => {
                    try {
                        // Envia o userId como query params na requisição DELETE

                        await api.delete(`/transactions/delete-all/${userId}`);

                        // Limpa a lista de transações e reseta o hashId
                        setTransactions([]);
                        showSuccessToast("Todas as transações e o hash foram excluídos com sucesso.");
                    } catch (error) {
                        const errorMessage =
                            error.response?.data?.error || "Erro ao excluir todas as transações.";
                        showErrorToast(errorMessage);
                    }
                },
                onCancel: () => {
                    showInfoToast("Ação cancelada.");
                },
            });
        } catch (error) {
            showErrorToast("Erro ao buscar hash ID.");
        }
    };


    // Buscar Transações, Categorias e Metas
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const categoryEndpoint =
                    user?.plan?.name === "Basic" ? "/categories/basic" : "/categories/premium";
                const categoriesResponse = await api.get(categoryEndpoint);
                setCategories(categoriesResponse.data);

                const transactionsResponse = await api.get("/transactions");
                setTransactions(transactionsResponse.data);
            } catch (error) {
                showErrorToast(error.response?.data?.error || "Erro ao carregar dados.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.plan?.name]);

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
            showInfoToast("Categorias sincronizadas!");
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


    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    };
    // Filtrar Transações
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearchQuery = filters.searchQuery
            ? transaction.description
                ?.toLowerCase()
                .includes(filters.searchQuery.toLowerCase())
            : true;

        const matchesMonth = filters.month
            ? new Date(transaction.date).getMonth() + 1 === parseInt(filters.month)
            : true;

        const matchesYear = filters.year
            ? new Date(transaction.date).getFullYear() === parseInt(filters.year)
            : true;

        const matchesType =
            filters.type === "Todos" || transaction.type === filters.type;

        const matchesCategory =
            !filters.category || transaction.category?.id === parseInt(filters.category);

        return (
            matchesSearchQuery &&
            matchesMonth &&
            matchesYear &&
            matchesType &&
            matchesCategory
        );
    });

    const handleSelectTransaction = (transactionId) => {
        setSelectedTransactions((prevSelected) => {
            if (prevSelected.includes(transactionId)) {
                // Remove se já estiver selecionado
                return prevSelected.filter((id) => id !== transactionId);
            } else {
                // Adiciona se não estiver selecionado
                return [...prevSelected, transactionId];
            }
        });
    };
    const handleDeleteSelectedTransactions = () => {
        if (selectedTransactions.length === 0) return;

        showConfirmDialog({
            title: "Confirmar Exclusão",
            message: `Tem certeza de que deseja excluir ${selectedTransactions.length} transações?`,
            onConfirm: async () => {
                try {

                    await api.delete("/transactions/batch-delete", {
                        data: { ids: selectedTransactions }, // Envia os IDs no corpo
                    });

                    // Remove as transações localmente
                    setTransactions((prevTransactions) =>
                        prevTransactions.filter((transaction) => !selectedTransactions.includes(transaction.id))
                    );

                    // Limpa a seleção
                    setSelectedTransactions([]);
                    showSuccessToast("Transações removidas com sucesso.");
                } catch (error) {
                    const errorMessage = error.response?.data?.error || "Erro desconhecido.";
                    showErrorToast(`Erro ao excluir transações: ${errorMessage}`);
                }
            },
            onCancel: () => {
                showInfoToast("Ação cancelada.");
            },
        });
    };


    const handleSelectAll = () => {
        if (selectedTransactions.length === filteredTransactions.length) {
            setSelectedTransactions([]); // Desmarca todos
        } else {
            setSelectedTransactions(filteredTransactions.map((t) => t.id)); // Seleciona todos
        }
    };

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
                    <div className="flex flex-wrap gap-2 mt-4 items-center">
                        {/* Botão Adicionar/Atualizar */}
                        <button
                            onClick={handleSaveTransaction}
                            className="px-4 py-2 bg-teal-600 text-white font-bold rounded-md shadow hover:bg-teal-700 transition-all duration-300"
                        >
                            {editingTransaction ? "Atualizar" : "Adicionar"}
                        </button>

                        {/* Botão de Importar CSV */}
                        {user?.plan?.name === "Premium" && (
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <span className="px-4 py-2 bg-teal-600 text-white font-bold rounded-md shadow hover:bg-teal-700 transition-all cursor-pointer">
                                    Importar CSV
                                </span>
                            </label>
                        )}

                        {/* Botão Cancelar */}
                        {editingTransaction && (
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-400 text-white font-bold rounded-md shadow hover:bg-gray-500 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtros e Barra de Pesquisa */}
                <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                    {/* Barra de Pesquisa */}
                    <input
                        type="text"
                        placeholder="Buscar por Descrição"
                        className="border-gray-300 border rounded-lg p-2 flex-grow"
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    />

                    {/* Dropdowns de Filtro e Botão */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Dropdown
                            options={[
                                { value: "", label: "Todos os Meses" },
                                ...monthNames.map((name, index) => ({
                                    value: index + 1,
                                    label: name,
                                })),
                            ]}
                            value={filters.month}
                            onChange={(value) => handleFilterChange("month", value)}
                            placeholder="Filtrar por Mês"
                        />
                        <Dropdown
                            options={[
                                { value: "", label: "Todos os Anos" },
                                ...Array.from(
                                    new Set(
                                        transactions.map((t) => new Date(t.date).getFullYear())
                                    )
                                ).map((year) => ({
                                    value: year,
                                    label: year,
                                })),
                            ]}
                            value={filters.year}
                            onChange={(value) => handleFilterChange("year", value)}
                            placeholder="Filtrar por Ano"
                        />
                        <Dropdown
                            options={[
                                { value: "Todos", label: "Todos os Tipos" },
                                { value: "expense", label: "Despesa" },
                                { value: "income", label: "Receita" },
                            ]}
                            value={filters.type}
                            onChange={(value) => handleFilterChange("type", value)}
                            placeholder="Filtrar por Tipo"
                        />
                        <Dropdown
                            options={[
                                { value: "", label: "Todas as Categorias" },
                                ...categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })),
                            ]}
                            value={filters.category}
                            onChange={(value) => handleFilterChange("category", value)}
                            placeholder="Filtrar por Categoria"
                        />

                        <button
                            onClick={handleDeleteSelectedTransactions}
                            disabled={selectedTransactions.length === 0}
                            className={`px-4 py-2 font-bold rounded-lg shadow-md transition-all duration-300 ${selectedTransactions.length > 0
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                        >
                            Remover Selecionados
                        </button>

                        {/* Botão de Excluir Tudo */}
                        <button
                            onClick={handleDeleteAllTransactions}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                        >
                            Excluir Tudo
                        </button>
                    </div>
                </div>


                {/* Tabela de Transações */}
                <div className="flex justify-center items-center bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-teal-600 text-white">
                                <th className="py-4 px-6 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedTransactions.length === filteredTransactions.length &&
                                            filteredTransactions.length > 0
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </th>
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
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-teal-100 transition-colors duration-200`}
                                >
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTransactions.includes(transaction.id)}
                                            onChange={() => handleSelectTransaction(transaction.id)}
                                        />
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.type === "income"
                                            ? "Receita"
                                            : transaction.type === "expense"
                                                ? "Despesa"
                                                : transaction.type}
                                    </td>                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.category?.name || "Sem Categoria"}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 text-sm">
                                        {transaction.description}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <button
                                            onClick={() => handleEditTransaction(transaction)}
                                            className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 mr-4"
                                        >
                                            Editar
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
