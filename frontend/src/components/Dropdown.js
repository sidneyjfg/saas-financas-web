import React, { useState } from "react";

export const Dropdown = ({ options, value, onChange, placeholder = "Selecione", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue); // Dispara o callback com o valor selecionado
    setIsOpen(false); // Fecha o menu
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botão de Seleção */}
      <div
        className={`border rounded-lg px-4 py-2 bg-white text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex justify-between items-center ${
          isOpen ? "ring-2 ring-teal-600" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? options.find((opt) => opt.value === value)?.label : placeholder}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Opções */}
      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-200"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2 hover:bg-teal-100 hover:text-teal-700 cursor-pointer transition-all duration-200"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};