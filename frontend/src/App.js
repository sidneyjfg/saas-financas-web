import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Estilos do toastify
import { useAuth } from "./contexts/AuthContext";
import VisitorNavbar from "./components/VisitorNavBar";
import AuthNavbar from "./components/AuthNavBar";
import AppRoutes from "./AppRoutes";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <AuthNavbar /> : <VisitorNavbar />}
      <ToastContainer 
        position="top-right" // Posição do toast
        autoClose={3000}     // Fecha automaticamente em 3 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Tema colorido
      />
      <AppRoutes />
    </>
  );
}

export default App;
