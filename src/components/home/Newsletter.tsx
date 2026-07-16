import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG } from "../../constants";
import { useTranslation } from "../../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const t = useTranslation();

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(el.querySelectorAll<HTMLElement>("[data-nl]"), {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setErrorMsg(t.newsletter.emailRequired); setStatus("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setErrorMsg(t.newsletter.emailInvalid); setStatus("error"); return; }
    setStatus("success");
    setEmail("");
    setErrorMsg("");
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Newsletter IntegralTech"
      className="newsletter-section"
      style={{
        background: CARD_BG,
        padding: "64px 32px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-xl)",
        border: `1px solid ${BORDER}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="newsletter-content"
        style={{
          width: "100%",
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <div
          data-nl
          style={{
            width: 60,
            height: 60,
            borderRadius: "16px",
            background: `${ORANGE}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: `1px solid ${ORANGE}20`,
          }}
        >
          <Mail size={26} color={ORANGE} />
        </div>

        {/* Badge */}
        <div
          data-nl
          style={{
            color: ORANGE,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          {t.newsletter.badge}
        </div>

        {/* Title */}
        <h2
          data-nl
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(26px, 4vw, 36px)",
            color: DARK,
            marginBottom: 16,
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            margin: "0 0 16px",
          }}
        >
          {t.newsletter.title}
        </h2>

        {/* Description */}
        <p
          data-nl
          style={{
            fontFamily: "Open Sans, sans-serif",
            color: BODY_TEXT,
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 520,
            margin: "0 auto 36px",
          }}
        >
          {t.newsletter.description}
        </p>

        {status === "success" ? (
          <div
            data-nl
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: 14,
              padding: "20px 32px",
            }}
          >
            <CheckCircle size={22} color="#22C55E" />
            <span
              style={{
                fontFamily: "Open Sans, sans-serif",
                color: "#22C55E",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {t.newsletter.success}
            </span>
          </div>
        ) : (
          <form
            className="newsletter-form"
            data-nl
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulaire d'inscription à la newsletter"
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                maxWidth: 520,
                margin: "0 auto",
                flexWrap: "wrap",
              }}
              className="newsletter-form-row"
            >
              <div className="newsletter-input-wrap" style={{ flex: 1, minWidth: 200 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={t.newsletter.placeholder}
                  aria-label={t.newsletter.ariaLabel}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: `1px solid ${status === "error" ? "#EF4444" : BORDER}`,
                    background: "#F8FAFC",
                    color: DARK,
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = ORANGE;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${ORANGE}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = status === "error" ? "#EF4444" : BORDER;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {status === "error" && errorMsg && (
                  <p
                    style={{
                      color: "#EF4444",
                      fontFamily: "Open Sans, sans-serif",
                      fontSize: 12,
                      marginTop: 6,
                      textAlign: "left",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}
              </div>
              <button
                className="newsletter-submit"
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: ORANGE,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 14px rgba(249, 115, 22, 0.2)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(249, 115, 22, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(249, 115, 22, 0.2)";
                }}
              >
                {t.newsletter.button}
                <ArrowRight size={16} />
              </button>
            </div>
            <p
              style={{
                fontFamily: "Open Sans, sans-serif",
                color: BODY_TEXT,
                fontSize: 12,
                marginTop: 14,
                opacity: 0.6,
              }}
            >
              {t.newsletter.disclaimer}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
