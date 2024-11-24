import React from "react";

export const PricingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-600 via-green-500 to-teal-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Nossos Planos
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in text-gray-200">
            Escolha o plano ideal para suas necessidades e alcance suas metas
            financeiras.
          </p>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">
            Planos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Plan 1 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Básico
              </h3>
              <p className="text-gray-500 mb-4">Grátis para sempre.</p>
              <ul className="text-gray-500 mb-6">
                <li>- Dashboards simples</li>
                <li>- Relatórios básicos</li>
                <li>- Até 1 meta financeira</li>
              </ul>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Escolher
              </button>
            </div>

            {/* Plan 2 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Profissional
              </h3>
              <p className="text-gray-500 mb-4">R$ 29,90/mês.</p>
              <ul className="text-gray-500 mb-6">
                <li>- Dashboards avançados</li>
                <li>- Relatórios completos</li>
                <li>- Gestão de múltiplas metas</li>
              </ul>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Escolher
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Empresarial
              </h3>
              <p className="text-gray-500 mb-4">R$ 99,90/mês.</p>
              <ul className="text-gray-500 mb-6">
                <li>- Dashboards para equipes</li>
                <li>- Relatórios detalhados</li>
                <li>- Suporte prioritário</li>
              </ul>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Escolher
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};