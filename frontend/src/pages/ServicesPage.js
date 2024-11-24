import React from "react";

export const ServicesPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-600 via-green-500 to-teal-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Nossos Serviços
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in text-gray-200">
            Descubra como podemos ajudá-lo a gerenciar suas finanças com
            eficiência e precisão.
          </p>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">
            O que Oferecemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Service 1 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Gestão de Orçamento
              </h3>
              <p className="text-gray-500">
                Organize suas receitas e despesas com facilidade, definindo
                orçamentos personalizados.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Dashboards Financeiros
              </h3>
              <p className="text-gray-500">
                Visualize seus dados financeiros em tempo real com gráficos
                interativos e claros.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Relatórios Avançados
              </h3>
              <p className="text-gray-500">
                Geração de relatórios que ajudam a entender seus gastos e
                identificar oportunidades de economia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
