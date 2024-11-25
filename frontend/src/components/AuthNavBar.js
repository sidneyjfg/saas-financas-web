import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthNavbar = () => {
  const { signOut, userPlan } = useAuth(); // Recupera o plano do usuário
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      <NavLink to="/dashboard" className="text-2xl font-bold leading-none text-teal-600">
        FinControl
      </NavLink>
      <ul className="hidden lg:flex lg:space-x-6">
        <li>
          <NavLink to="/reports" className="text-sm text-gray-600 hover:text-teal-600 transition duration-300">
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className="text-sm text-gray-600 hover:text-teal-600 transition duration-300">
            Transactions
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className="text-sm text-gray-600 hover:text-teal-600 transition duration-300">
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/goals" className="text-sm text-gray-600 hover:text-teal-600 transition duration-300">
            Goals
          </NavLink>
        </li>
        {userPlan === "Premium" && ( // Apenas para usuários premium
          <li>
            <NavLink to="/team-management" className="text-sm text-gray-600 hover:text-teal-600 transition duration-300">
              Team Management
            </NavLink>
          </li>
        )}
      </ul>
      <div className="hidden lg:flex">
        <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white rounded-lg">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
