import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, CheckCircle } from "lucide-react";
import { DARK, NAVY, ORANGE } from "../../constants";
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
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a2a4a 100%)`, padding: "80px 80px" }}
      className="newsletter-section"
    >
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <div
          data-nl
          style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(230,126,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
        >
          <Mail size={28} color={ORANGE} />
        </div>

        <div data-nl style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
          {t.newsletter.badge}
        </div>

        <h2 data-nl style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
          {t.newsletter.title}
        </h2>

        <p data-nl style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
          {t.newsletter.description}
        </p>

        {status === "success" ? (
          <div
            data-nl
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(129,199,132,0.15)", border: "1px solid rgba(129,199,132,0.4)", borderRadius: 12, padding: "20px 32px" }}
          >
            <CheckCircle size={22} color="#81C784" />
            <span style={{ fontFamily: "Open Sans, sans-serif", color: "#81C784", fontSize: 15, fontWeight: 700 }}>
              {t.newsletter.success}
            </span>
          </div>
        ) : (
          <form data-nl onSubmit={handleSubmit} noValidate aria-label="Formulaire d'inscription à la newsletter">
            <div style={{ display: "flex", gap: 12, maxWidth: 520, margin: "0 auto", flexWrap: "wrap" }} className="newsletter-form-row">
              <div style={{ flex: 1, minWidth: 200 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  placeholder={t.newsletter.placeholder}
                  aria-label={t.newsletter.ariaLabel}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 10,
                    border: `1px solid ${status === "error" ? "#e74c3c" : "rgba(255,255,255,0.15)"}`,
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = ORANGE; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = status === "error" ? "#e74c3c" : "rgba(255,255,255,0.15)"; }}
                />
                {status === "error" && errorMsg && (
                  <p style={{ color: "#FF8A65", fontFamily: "Open Sans, sans-serif", fontSize: 12, marginTop: 6, textAlign: "left" }}>{errorMsg}</p>
                )}
              </div>
              <button
                type="submit"
                style={{ padding: "14px 28px", background: ORANGE, color: "#fff", border: "none", borderRadius: 10, fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.25, ease: "power2.out" })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" })}
              >
                {t.newsletter.button} →
              </button>
            </div>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 14 }}>
              {t.newsletter.disclaimer}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
