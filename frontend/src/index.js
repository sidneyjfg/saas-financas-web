import React from "react";
import ReactDOM from "react-dom/client"; // Substitua por este módulo
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
