// Renders toasts, lives at the app root

import { toast, ToastType } from "./toast";
import { useToasts } from "./useToast";

const colorMap: Record<ToastType, string> = {
  success: "#4caf50",
  error: "#f44336",
  info: "#2196f3",
  warning: "#ff9800",
};

export const ToastContainer = () => {
  const toasts = useToasts();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map(({ message, id, type }) => {
        return (
          <div
            key={id}
            style={{
              background: colorMap[type],
              padding: "12px 16px",
              borderRadius: 8,
              color: "#fff",
            }}
          >
            {message}
            <button
              onClick={() => {
                toast.dismiss(id);
              }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};
