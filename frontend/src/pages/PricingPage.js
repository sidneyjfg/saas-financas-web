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
            financeiras com ferramentas personalizadas.
          </p>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">
            Planos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Plano Básico */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">Básico</h3>
              <p className="text-gray-500 mb-4">Grátis para sempre.</p>
              <ul className="text-gray-500 mb-6 text-left">
                <li>- Dashboards simples</li>
                <li>- Relatórios básicos</li>
                <li>- Até 5 categorias</li>
                <li>- Até 1 meta financeira</li>
                <li>- Sem importação de relatórios bancários</li>
              </ul>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Escolher
              </button>
            </div>

            {/* Plano Premium */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Premium
              </h3>
              <p className="text-gray-500 mb-4">R$ 49,90/mês.</p>
              <ul className="text-gray-500 mb-6 text-left">
                <li>- Dashboards avançados</li>
                <li>- Relatórios completos</li>
                <li>- Importação de relatórios bancários (CSV)</li>
                <li>- Notificações de eventos importantes (Metas e despesas)</li>
                <li>- Gestão de até 20 categorias</li>
                <li>- Até 10 metas financeiras</li>
                <li>- Suporte via e-mail</li>
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
