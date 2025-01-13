import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import { useAuth } from "../contexts/AuthContext";

const AuthNavbar = () => {
  const { user, signOut } = useAuth(); // Assumindo que o contexto Auth retorna o usuário logado
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    showSuccessToast("Desconectado com sucesso.");
    signOut();
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      {/* Logo ou título */}
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

      {/* Menu suspenso para usuário */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none"
        >
          <span>{user?.name || "Usuário"}</span> {/* Nome do usuário */}
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
    </nav>
  );
};

export default AuthNavbar;
