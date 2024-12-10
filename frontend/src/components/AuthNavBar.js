import { NavLink, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import { useAuth } from "../contexts/AuthContext";

const AuthNavbar = () => {
  const { signOut, userPlan } = useAuth();
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
            Reports
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
            Transactions
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
            Categories
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
            Goals
          </NavLink>
        </li>

        {/* Menu suspenso de Team Management para usuários Premium */}
        {userPlan === "Premium" && (
          <li
            className="relative group" // Use "group" para gerenciar o hover em todo o contêiner
          >
            <li>
              <NavLink
                to="/team-management"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm text-teal-600 font-bold transition duration-300"
                    : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
                }
              >
                Team Management
              </NavLink>
            </li>
            <ul
              className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <li>
                <NavLink
                  to="/team-management/team-goals"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                >
                  Goals & Budgets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team-management/audit-logs"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                >
                  Audit Logs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team-management/settings"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </li>
        )}
      </ul>
      <div className="hidden lg:flex">
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
