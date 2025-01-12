import { NavLink, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import { useAuth } from "../contexts/AuthContext";

const AuthNavbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    showSuccessToast("Desconectado com sucesso.");
    signOut();
    navigate("/signin");
  };

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      <NavLink to="/reports" className="text-2xl font-bold leading-none text-teal-600">
        FinControl
      </NavLink>
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
      <div className="hidden lg:flex">
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white rounded-lg"
        >
          Sair
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
