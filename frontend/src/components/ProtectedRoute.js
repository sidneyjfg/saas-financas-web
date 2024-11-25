import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredPlan }) => {
  const { isAuthenticated, userPlan } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (requiredPlan && userPlan !== requiredPlan) {
    return <Navigate to="/reports" />; // Redireciona para o dashboard caso o plano não seja suficiente
  }

  return children;
};

export default ProtectedRoute;
