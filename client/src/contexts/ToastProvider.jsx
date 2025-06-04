import React, { useState } from "react";
import { ToastContext } from "@/contexts/ToastContext.jsx";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "error", title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showError = (title, message, duration = 5000) => {
    addToast({ type: "error", title, message, duration });
  };

  const showSuccess = (title, message, duration = 5000) => {
    addToast({ type: "success", title, message, duration });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    showError,
    showSuccess,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
