import { useEffect, type RefObject } from "react";

interface UseClickOutsideParams {
  ref: RefObject<HTMLElement | null>;
  onClickOutside: () => void;
  enabled?: boolean;
}

export function useClickOutside({ ref, onClickOutside, enabled = true }: UseClickOutsideParams) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (!ref.current) return;
      if (!ref.current.contains(target)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside, enabled]);
}
