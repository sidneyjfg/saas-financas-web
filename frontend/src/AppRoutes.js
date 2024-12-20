import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  PricingPage,
  ReportsPage,
  GoalsPage,
  LoginPage,
  RegisterPage,
  TeamManagement,
  CategoriesPage,
  TransactionsPage,
  TransactionsTeamPage,
  AuditLogsPage,
  SettingsPage,
  TeamGoalsPage,
  TeamDetailsPage,
} from "./pages/";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />

      {/* Rota de Team Management */}
      <Route
        path="/team-management"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TeamManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/transactions"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TransactionsTeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/team-details"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TeamDetailsPage />
          </ProtectedRoute>
        }
      />     
      
      <Route
        path="/team-management/team-goals"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TeamGoalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/audit-logs"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team-management/settings"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
