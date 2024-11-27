import { NavLink } from "react-router-dom";

const VisitorNavbar = () => {
  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      <NavLink
        to="/"
        className="text-2xl font-bold leading-none text-teal-600"
      >
        FinControl
      </NavLink>
      <ul className="hidden lg:flex lg:space-x-6">
      <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Start
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Services
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              isActive
                ? "text-sm text-teal-600 font-bold transition duration-300"
                : "text-sm text-gray-600 hover:text-teal-600 transition duration-300"
            }
          >
            Pricing
          </NavLink>
        </li>
      </ul>
      <div className="hidden lg:flex">
        <NavLink
          to="/signin"
          className={({ isActive }) =>
            isActive
              ? "py-2 px-4 bg-gray-300 rounded-lg font-bold mr-3"
              : "py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg mr-3"
          }
        >
          Sign In
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive
              ? "py-2 px-4 bg-teal-600 text-white rounded-lg font-bold"
              : "py-2 px-4 bg-teal-600 text-white hover:bg-teal-700 rounded-lg"
          }
        >
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
};

export default VisitorNavbar;
