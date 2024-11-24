import React from "react";

export const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-600 via-green-500 to-teal-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Domine Seu Controle Financeiro
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in text-gray-200">
            Dashboards interativos, relatórios precisos e a gestão que você
            precisa para alcançar seus objetivos financeiros.
          </p>
          <a
            href="#features"
            className="inline-block px-8 py-3 bg-white text-teal-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Veja Mais
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 text-teal-600">
                <svg
                  className="w-16 h-16 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21v-6m-6 6h6m0 0h6m0 0h6m-6-6v6m0 0V9m-6-4V3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Dashboards Interativos
              </h3>
              <p className="text-gray-500">
                Acompanhe suas finanças em tempo real com gráficos claros e
                detalhados.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 text-teal-600">
                <svg
                  className="w-16 h-16 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21v-6m-6 6h6m0 0h6m0 0h6m-6-6v6m0 0V9m-6-4V3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Relatórios Detalhados
              </h3>
              <p className="text-gray-500">
                Geração de relatórios que ajudam você a tomar decisões mais
                inteligentes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 text-teal-600">
                <svg
                  className="w-16 h-16 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21v-6m-6 6h6m0 0h6m0 0h6m-6-6v6m0 0V9m-6-4V3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Gestão de Objetivos
              </h3>
              <p className="text-gray-500">
                Estabeleça metas financeiras e acompanhe seu progresso com
                facilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-teal-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para Transformar Suas Finanças?
          </h2>
          <p className="text-lg mb-8">
            Comece hoje mesmo a usar o FinControl e alcance seus objetivos
            financeiros.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-teal-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Comece Agora
          </a>
        </div>
      </section>
    </div>
  );
};