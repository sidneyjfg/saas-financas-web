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
  OverviewPage,
  TransactionsTeamPage,
  GoalsBudgetsPage,
  AuditLogsPage,
  SettingsPage,
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
        path="/team-management/overview"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/:teamId/overview"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/:teamId/transactions"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TransactionsTeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management/:teamId/goals-budgets"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <GoalsBudgetsPage />
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
        path="/team-management/:teamId/settings"
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
