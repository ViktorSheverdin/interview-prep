import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number): string => {
  const [debouncedVal, setDebouncedVal] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);
    return clearTimeout(timer);
  }, [value, delay]);
  return debouncedVal;
};
