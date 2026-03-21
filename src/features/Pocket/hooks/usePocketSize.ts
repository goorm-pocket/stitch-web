import { useEffect, useState } from "react";

export function usePocketSize(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateSize = () => {
      if (!wrapperRef.current) return;

      const nextWidth = wrapperRef.current.clientWidth;
      const nextHeight = nextWidth * 1.08;
      setSize({
        width: nextWidth,
        height: nextHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(wrapperRef.current);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [wrapperRef]);
  return size;
}
