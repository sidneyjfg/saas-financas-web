import { useAuth } from "./contexts/AuthContext";
import VisitorNavbar from "./components/VisitorNavBar";
import AuthNavbar from "./components/AuthNavBar";
import AppRoutes from "./AppRoutes";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <AuthNavbar /> : <VisitorNavbar />}
      <AppRoutes />
    </>
  );
}

export default App;
