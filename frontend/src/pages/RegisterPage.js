import React, { useState } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    planId: 1, // ID padrão do plano básico
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "planId" ? Number(value) : value, // Converte planId para número
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.planId
      );
      showSuccessToast("Registro realizado com sucesso!");
      navigate("/signin");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      showErrorToast("Erro ao realizar o registro: ", err.response?.data?.message)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-indigo-500 to-blue-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Create a password"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="planId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Plan
            </label>
            <select
              id="planId"
              value={formData.planId}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={1}>Basic</option>
              <option value={2}>Premium</option>
            </select>

          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};