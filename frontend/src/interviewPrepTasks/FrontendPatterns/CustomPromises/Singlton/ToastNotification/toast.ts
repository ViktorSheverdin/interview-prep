// Plain module is already a signleton in JS so no class is needed

export type ToastType = "success" | "error" | "info" | "warning";

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
}

let listeners: Array<(toasts: IToast[]) => void> = [];
let toasts: IToast[] = [];

const notify = () => {
  listeners.forEach((cb) => cb([...toasts]));
};

const dismiss = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
};

const show = (message: string, type: ToastType = "info") => {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => dismiss(id), 4000);
};

const subscribe = (cb: (toasts: IToast[]) => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};

export const toast = { dismiss, show, subscribe };
