import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import api from "../services/api";

export const AuthNavbar = () => {
  const { user, signOut } = useAuth();
  const { notifications, unreadNotifications, fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    showSuccessToast("Desconectado com sucesso.");
    signOut();
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleNotifications = async () => {
    const willOpen = !isNotificationsOpen;
    setIsNotificationsOpen(willOpen);

    if (willOpen) {
      // Buscar notificações ao abrir o dropdown
      console.log("🔔 Buscando notificações do backend...");
      await fetchNotifications();
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, null, { withCredentials: true });
      console.log(`📘 Notificação ${id} marcada como lida.`);
      // Atualizar notificações
      await fetchNotifications();
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  // Fechamento automático do dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      {/* Logo */}
      <NavLink to="/reports" className="text-2xl font-bold leading-none text-teal-600">
        FinControl
      </NavLink>

      {/* Links de navegação */}
      <ul className="hidden lg:flex lg:space-x-6">
        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Relatórios
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Transações
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Categorias
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Metas
          </NavLink>
        </li>
      </ul>

      {/* Notificações e menu suspenso */}
      <div className="flex items-center space-x-4 relative">
        {/* Ícone de notificações */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isNotificationsOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-teal-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405C18.79 14.21 18 12.92 18 11.5V7a6 6 0 00-12 0v4.5c0 1.42-.79 2.71-1.595 3.095L3 17h5m6 0a3 3 0 01-6 0m6 0H9"
              />
            </svg>
            {unreadNotifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10">
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">Notificações</h3>
                <ul className="mt-2">
                  {notifications.length === 0 ? (
                    <li className="text-sm text-gray-600 py-2">Sem notificações no momento.</li>
                  ) : (
                    notifications.map((notification, index) => (
                      <li
                        key={index}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`text-sm text-gray-600 border-b py-2 hover:bg-gray-100 cursor-pointer ${
                          !notification.isRead ? "font-bold" : ""
                        }`}
                      >
                        {notification.dataValues?.message || notification.message}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Menu suspenso para usuário */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <span>{user?.name || "Usuário"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <NavLink
                to="/account/edit"
                className="block px-4 py-2 text-gray-800 hover:bg-teal-600 hover:text-white transition"
              >
                Editar Conta
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

}
export default AuthNavbar;
