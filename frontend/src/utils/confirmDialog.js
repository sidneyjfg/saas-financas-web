import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from "react-confirm-alert";

/**
 * Função global para exibir uma caixa de diálogo de confirmação.
 * @param {string} title - Título do modal de confirmação.
 * @param {string} message - Mensagem do modal.
 * @param {Function} onConfirm - Callback executado ao clicar em "Sim".
 * @param {Function} onCancel - Callback opcional executado ao clicar em "Não".
 */
export const showConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  confirmAlert({
    title: title || "Confirmação",
    message: message || "Você tem certeza desta ação?",
    buttons: [
      {
        label: "Sim",
        onClick: onConfirm,
      },
      {
        label: "Não",
        onClick: onCancel || (() => {}), // Callback vazio se não for fornecido
      },
    ],
  });
};
