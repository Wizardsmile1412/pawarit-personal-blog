import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./assets/Global.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/authentication.jsx";
import jwtInterceptor from "./utils/jwtInterceptor.js";
import axiosInstance from "@/api/axiosInstance.js";

jwtInterceptor();
jwtInterceptor(axiosInstance);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
