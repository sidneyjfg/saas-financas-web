import { Routes, Route } from "react-router-dom";
import { HomePage, AboutPage, ServicesPage, PricingPage, ReportsPage, GoalsPage, LoginPage, RegisterPage, TeamManagement, CategoriesPage, TransactionsPage, OverviewPage, TransactionsTeamPage, GoalsBudgetsPage, AuditLogsPage, SettingsPage } from "./pages/";
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

      {/* Rotas Aninhadas para Team Management */}
      <Route
        path="/team-management/*"
        element={
          <ProtectedRoute requiredPlan="Premium">
            <TeamManagement />
          </ProtectedRoute>
        }
      >
        <Route path=":teamId/overview" element={<OverviewPage />} />
        <Route path=":teamId/transactions" element={<TransactionsTeamPage />} />
        <Route path=":teamId/goals-budgets" element={<GoalsBudgetsPage />} />
        <Route path=":teamId/audit-logs" element={<AuditLogsPage />} />
        <Route path=":teamId/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
