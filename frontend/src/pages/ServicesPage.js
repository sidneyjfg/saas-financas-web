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
            eficiência, clareza e inteligência.
          </p>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">
            O que Oferecemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Service 1 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  📊
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Gestão de Orçamento
              </h3>
              <p className="text-gray-500 mb-4">
                Organize suas receitas e despesas com facilidade, definindo
                orçamentos personalizados e mantendo suas finanças sob controle.
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Acompanhe seus gastos em tempo real.</li>
                <li>- Estabeleça limites de despesas mensais.</li>
                <li>- Receba alertas ao atingir 80% do orçamento.</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  📈
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Dashboards Financeiros
              </h3>
              <p className="text-gray-500 mb-4">
                Visualize seus dados financeiros com gráficos modernos e
                interativos, permitindo análises rápidas e claras.
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Gráficos personalizáveis para receitas e despesas.</li>
                <li>- Insights detalhados por categoria e período.</li>
                <li>- Identificação de padrões financeiros recorrentes.</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  📝
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Relatórios Avançados
              </h3>
              <p className="text-gray-500 mb-4">
                Gere relatórios financeiros detalhados para compreender melhor
                seus hábitos de consumo e encontrar oportunidades de economia.
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Relatórios mensais e anuais completos.</li>
                <li>- Exportação de relatórios em CSV ou PDF.</li>
                <li>- Análises automáticas de despesas e rendimentos.</li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  🎯
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Metas Financeiras
              </h3>
              <p className="text-gray-500 mb-4">
                Defina metas financeiras e acompanhe seu progresso de forma
                prática e visual.
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Criação de metas personalizadas.</li>
                <li>- Progresso visual em gráficos e relatórios.</li>
                <li>- Notificações ao atingir 50% ou 100% da meta.</li>
              </ul>
            </div>

            {/* Service 5 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  💳
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Importação de Relatórios Bancários
              </h3>
              <p className="text-gray-500 mb-4">
                Conecte-se ao Nubank e importe suas transações automaticamente.
                Em breve, expandiremos o suporte para outros bancos!
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Integração exclusiva com Nubank.</li>
                <li>- Organização automática por categorias.</li>
                <li>- Suporte futuro para bancos como Itaú e Bradesco.</li>
              </ul>
            </div>

            {/* Service 6 */}
            <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
              <div className="mb-4">
                <span className="text-5xl text-teal-600">
                  📬
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-700">
                Notificações Inteligentes
              </h3>
              <p className="text-gray-500 mb-4">
                Receba alertas importantes para manter suas finanças no caminho
                certo.
              </p>
              <ul className="text-left text-gray-500 space-y-2">
                <li>- Alerta de despesas acima de 80% do orçamento.</li>
                <li>- Notificação ao atingir 50% da meta financeira.</li>
                <li>- Alertas personalizados baseados nos seus objetivos.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
