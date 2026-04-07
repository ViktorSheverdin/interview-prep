import { useEffect, useState } from "react";
import { IToast, toast } from "./toast";

export const useToasts = (): IToast[] => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);
  return toasts;
};
