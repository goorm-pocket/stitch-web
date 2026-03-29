import { useEffect, type RefObject } from "react";

interface UseInfiniteScrollParams {
  enabled: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  rootRef?: RefObject<HTMLElement | null>;
  targetRef: RefObject<HTMLElement | null>;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
}

export function useInfiniteScroll({
  enabled,
  hasNextPage,
  isFetchingNextPage,
  rootRef,
  targetRef,
  onIntersect,
}: UseInfiniteScrollParams) {
  useEffect(() => {
    if (!enabled) return;
    if (!hasNextPage) return;

    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onIntersect();
        }
      },
      {
        root: rootRef?.current ?? null,
      },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasNextPage, isFetchingNextPage, rootRef, targetRef, onIntersect]);
}
