import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageTransition } from "../context/PageTransitionContext";

/**
 * Hook to automatically animate page transitions when route changes
 * Animates the page out on route change, then in when new page mounts
 */
export function usePageTransitionEffect() {
  const location = useLocation();
  const { animatePageOut, animatePageIn } = usePageTransition();

  useEffect(() => {
    // Animate page in when component mounts with new location
    animatePageIn(0.6);

    return () => {
      // This runs before the next route, but we handle the out animation
      // in a scroll handler or route listener
    };
  }, [location.pathname, animatePageIn]);
}
