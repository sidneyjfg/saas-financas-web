import { Routes, Route } from "react-router-dom";
import { HomePage, AboutPage, ServicesPage, PricingPage, ReportsPage, GoalsPage, LoginPage, RegisterPage } from "./pages/";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Login e Registro */}
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Navegação HomePage */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Navegação do sistema */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/goals" element={<GoalsPage />} />
    </Routes>
  );
}

export default AppRoutes;
