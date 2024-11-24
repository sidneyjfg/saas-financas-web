import Navbar from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (

    <AuthProvider>
      <>
        <Navbar />
        <AppRoutes />
      </>
    </AuthProvider>

  );
}

export default App;
