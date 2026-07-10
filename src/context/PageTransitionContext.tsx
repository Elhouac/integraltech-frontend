import React, { createContext, useContext, useCallback } from "react";
import { gsap } from "gsap";

type PageTransitionContextValue = {
  animatePageOut: () => Promise<void>;
  animatePageIn: (duration?: number) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const animatePageOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const duration = 0.6;
      gsap.to("main#main-content", {
        autoAlpha: 0,
        y: 12,
        duration,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }, []);

  const animatePageIn = useCallback((duration: number = 0.6) => {
    gsap.set("main#main-content", { clearProps: "all" });
    gsap.fromTo(
      "main#main-content",
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration, ease: "power2.inOut" }
    );
  }, []);

  return (
    <PageTransitionContext.Provider value={{ animatePageOut, animatePageIn }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}
