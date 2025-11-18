import { useEffect, useRef, useState } from "react";

type UseLoaderTransitionOptions = {
  minimumVisibleMs?: number;
  fadeDurationMs?: number;
};

type LoaderTransitionState = {
  isMounted: boolean;
  isFadingOut: boolean;
};

export const useLoaderTransition = (
  loading: boolean,
  options: UseLoaderTransitionOptions = {}
): LoaderTransitionState => {
  const { minimumVisibleMs = 700, fadeDurationMs = 400 } = options;
  const [isMounted, setIsMounted] = useState<boolean>(loading);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const loadStartedAtRef = useRef<number>(loading ? Date.now() : 0);
  const fadeTimeoutRef = useRef<number>();
  const unmountTimeoutRef = useRef<number>();

  const clearTimers = () => {
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = undefined;
    }
    if (unmountTimeoutRef.current) {
      window.clearTimeout(unmountTimeoutRef.current);
      unmountTimeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    if (loading) {
      loadStartedAtRef.current = Date.now();
      setIsMounted(true);
      setIsFadingOut(false);
      clearTimers();
      return () => {
        clearTimers();
      };
    }

    const elapsed = Date.now() - loadStartedAtRef.current;
    const delay = Math.max(minimumVisibleMs - elapsed, 0);

    fadeTimeoutRef.current = window.setTimeout(() => {
      setIsFadingOut(true);
    }, delay);

    unmountTimeoutRef.current = window.setTimeout(() => {
      setIsMounted(false);
    }, delay + fadeDurationMs);

    return () => {
      clearTimers();
    };
  }, [loading, minimumVisibleMs, fadeDurationMs]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return { isMounted, isFadingOut };
};

