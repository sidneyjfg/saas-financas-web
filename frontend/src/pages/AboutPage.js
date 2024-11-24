import React from "react";

export const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-600 via-green-500 to-teal-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Sobre o FinControl
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in text-gray-200">
            Nosso objetivo é ajudar você a alcançar o controle financeiro com
            ferramentas modernas, intuitivas e eficazes.
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-12">Quem Somos</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">
            O FinControl é uma plataforma desenvolvida para tornar a gestão
            financeira mais simples e poderosa. Oferecemos ferramentas de
            análise, relatórios detalhados e dashboards interativos para ajudar
            você a tomar decisões inteligentes sobre suas finanças.
          </p>
          <img
            src="https://via.placeholder.com/800x400"
            alt="Equipe FinControl"
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </section>
    </div>
  );
};
