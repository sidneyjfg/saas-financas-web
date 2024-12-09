import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ReportProvider } from "./contexts/ReportContext";
import { TeamProvider } from "./contexts/TeamContext";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ReportProvider>
        <TeamProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TeamProvider>
      </ReportProvider>
    </AuthProvider>
  </React.StrictMode>
);
