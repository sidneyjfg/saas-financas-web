import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredPlan }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (requiredPlan && user?.plan?.name !== requiredPlan) {
    return <Navigate to="/reports" />; // Redireciona para o dashboard caso o plano não seja suficiente
  }

  return children;
};

export default ProtectedRoute;
