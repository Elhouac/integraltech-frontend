import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD = 350;
const DARK = "#2C3E50";
const ORANGE = "#E67E22";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [canAnimate, setCanAnimate] = useState(true);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const scrollListenerRef = useRef<((e: Event) => void) | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // Create a single scroll listener function
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const isScrolled = scrollTop > SCROLL_THRESHOLD;

      if (isScrolled && !isVisible) {
        setIsVisible(true);
      } else if (!isScrolled && isVisible) {
        setIsVisible(false);
      }
    };

    // Store the listener for cleanup
    scrollListenerRef.current = handleScroll;

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isVisible]);

  // Handle visibility changes with GSAP animations
  useEffect(() => {
    if (!buttonRef.current) return;

    // Kill previous timeline if exists
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const button = buttonRef.current;

    if (prefersReducedMotion) {
      // Instant show/hide for users who prefer reduced motion
      gsap.set(button, { autoAlpha: isVisible ? 1 : 0 });
      setCanAnimate(true);
    } else {
      timelineRef.current = gsap.timeline();

      if (isVisible) {
        // Fade in with slight scale
        timelineRef.current.fromTo(
          button,
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out" }
        );
      } else {
        // Fade out with slight scale
        timelineRef.current.to(button, {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      setCanAnimate(true);
    }
  }, [isVisible, prefersReducedMotion]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!canAnimate) return;

    // Scroll to top of page (Hero section)
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    // Reset scroll listener state
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && buttonRef.current && canAnimate) {
      // Bounce animation on hover
      gsap.to(buttonRef.current, {
        scale: 1.15,
        duration: 0.3,
        ease: "back.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion && buttonRef.current && canAnimate) {
      // Return to normal scale
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Retour en haut"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: "48px",
        height: "48px",
        minWidth: "44px",
        minHeight: "44px",
        padding: 0,
        border: "none",
        borderRadius: "12px",
        background: DARK,
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 999,
        opacity: 0,
        visibility: "hidden",
        transition: prefersReducedMotion ? "none" : "undefined",
        fontSize: 0,
      }}
    >
      <ChevronUp size={24} aria-hidden="true" />
    </button>
  );
}
