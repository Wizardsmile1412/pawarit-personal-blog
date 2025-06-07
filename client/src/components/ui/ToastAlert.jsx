import React, { useEffect, useContext } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { ToastContext } from "@/contexts/ToastContext.jsx";

export const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed right-2 z-50 space-y-2 top-[600px] md:right-4 ">
      {toasts.map((toast) => (
        <ToastAlert
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export const ToastAlert = ({
  type = "error",
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    error: "bg-red-500 border-red-600",
    success: "bg-green-500 border-green-600",
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-white" />,
    success: <CheckCircle className="w-5 h-5 text-white" />,
  };

  return (
    <div
      className={`${alertStyles[type]} border rounded-lg p-4 text-white shadow-lg max-w-sm md:max-w-lg w-full mx-auto mb-4 animate-in slide-in-from-top duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-white text-sm opacity-90">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
