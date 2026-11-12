import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function showToast(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("universe-toast", {
      detail: { message, type, id: Date.now() },
    })
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    };

    window.addEventListener("universe-toast", handleToast);
    return () => window.removeEventListener("universe-toast", handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {toast.type === "success" ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <AlertCircle size={18} color="#ef4444" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: "var(--text-muted)", display: "flex" }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
