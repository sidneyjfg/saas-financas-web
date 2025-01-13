import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ReportProvider } from "./contexts/ReportContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <ReportProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReportProvider>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);
