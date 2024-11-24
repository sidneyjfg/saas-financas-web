import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-100 shadow-md">
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold leading-none text-teal-600">
        FinControl
      </NavLink>

      {/* Links Centralizados */}
      <ul className="hidden lg:flex lg:mx-auto lg:space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "font-bold text-teal-600" : "text-gray-600"
              } hover:text-teal-600 transition duration-300`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "font-bold text-teal-600" : "text-gray-600"
              } hover:text-teal-600 transition duration-300`
            }
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "font-bold text-teal-600" : "text-gray-600"
              } hover:text-teal-600 transition duration-300`
            }
          >
            Services
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "font-bold text-teal-600" : "text-gray-600"
              } hover:text-teal-600 transition duration-300`
            }
          >
            Pricing
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "font-bold text-teal-600" : "text-gray-600"
              } hover:text-teal-600 transition duration-300`
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Sign In and Sign Up Buttons */}
      <div className="hidden lg:flex lg:items-center">
        <NavLink
          to="/signin"
          className="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 font-bold rounded-lg transition duration-300 mr-3"
        >
          Sign In
        </NavLink>
        <NavLink
          to="/signup"
          className="py-2 px-6 bg-teal-600 hover:bg-teal-700 text-sm text-white font-bold rounded-lg transition duration-300"
        >
          Sign Up
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden navbar-burger flex items-center text-teal-600 p-3"
        onClick={toggleMenu}
      >
        <svg
          className="block h-6 w-6"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-gray-100 shadow-lg lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul className="space-y-4 px-4 py-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block text-sm ${
                  isActive ? "font-bold text-teal-600" : "text-gray-600"
                } hover:text-teal-600 transition duration-300`
              }
              onClick={toggleMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block text-sm ${
                  isActive ? "font-bold text-teal-600" : "text-gray-600"
                } hover:text-teal-600 transition duration-300`
              }
              onClick={toggleMenu}
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `block text-sm ${
                  isActive ? "font-bold text-teal-600" : "text-gray-600"
                } hover:text-teal-600 transition duration-300`
              }
              onClick={toggleMenu}
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `block text-sm ${
                  isActive ? "font-bold text-teal-600" : "text-gray-600"
                } hover:text-teal-600 transition duration-300`
              }
              onClick={toggleMenu}
            >
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block text-sm ${
                  isActive ? "font-bold text-teal-600" : "text-gray-600"
                } hover:text-teal-600 transition duration-300`
              }
              onClick={toggleMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
