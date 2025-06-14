import React, { useState } from "react";
import { ToastContext } from "@/contexts/ToastContext.jsx";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "error", title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showError = (titleOrMessage, message, duration = 5000) => {
    if (message === undefined) {
      addToast({
        type: "error",
        title: "Error",
        message: titleOrMessage,
        duration,
      });
    } else {
      addToast({
        type: "error",
        title: titleOrMessage,
        message,
        duration,
      });
    }
  };

  const showSuccess = (titleOrMessage, message, duration = 5000) => {
    if (message === undefined) {
      addToast({
        type: "success",
        title: "Success",
        message: titleOrMessage,
        duration,
      });
    } else {
      addToast({
        type: "success",
        title: titleOrMessage,
        message,
        duration,
      });
    }
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
