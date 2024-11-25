import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth(); // O signIn agora chama o backend
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login form... | ",email,password);
      await signIn(email, password); // Passa email e senha para o signIn
      navigate("/reports"); // Redireciona após login bem-sucedido
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-indigo-500 to-blue-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
