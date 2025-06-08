import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@/styles/globals.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthenticationContext.jsx";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext.jsx";
import "@/api/axiosInstance.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
