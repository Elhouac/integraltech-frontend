import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, ChevronDown, Facebook, Linkedin, Instagram, Twitter, Youtube } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string; email: string; phone: string; subject: string; message: string;
}
interface FormErrors { name?: string; email?: string; phone?: string; subject?: string; message?: string; }

const FAQ_ITEMS = [
  { q: "Quel est votre délai de réponse moyen ?", a: "Notre équipe s'engage à répondre à toutes les demandes dans un délai de 24 heures ouvrées. Pour les urgences techniques, notre support est disponible 24/7." },
  { q: "Proposez-vous des audits IT gratuits ?", a: "Oui, nous offrons un premier audit de votre infrastructure IT sans engagement. Cet audit nous permet de comprendre vos besoins et de vous proposer des solutions adaptées." },
  { q: "Intervenez-vous dans toutes les régions du Maroc ?", a: "Nous intervenons sur tout le territoire marocain depuis notre siège à Casablanca. Nous disposons également de partenaires locaux dans les principales villes du royaume." },
  { q: "Quels secteurs d'activité accompagnez-vous ?", a: "IntegralTech intervient dans tous les secteurs : industrie, finance, santé, distribution, services publics, PME et grandes entreprises." },
  { q: "Proposez-vous des contrats de maintenance annuels ?", a: "Oui, nous proposons des contrats de support et maintenance adaptés à vos besoins : basique, standard ou premium, avec différents niveaux de réactivité et de couverture." },
];

// ─── FAQ ITEM ──────────────────────────────────────────────────────────────────
function FaqItem({ item, index }: { item: (typeof FAQ_ITEMS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = answerRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "20px 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK,
          textAlign: "left", padding: 0,
        }}
        aria-expanded={open}
      >
        <span>{index + 1}. {item.q}</span>
        <ChevronDown
          size={18}
          color={ORANGE}
          style={{ flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      <div ref={answerRef} style={{ height: 0, overflow: "hidden" }}>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, lineHeight: 1.8, marginTop: 12, paddingRight: 32 }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}

// ─── CONTACT FORM ──────────────────────────────────────────────────────────────
function ContactFormFull() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Le nom est obligatoire.";
    if (!form.email.trim()) e.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse email invalide.";
    if (!form.subject.trim()) e.subject = "Le sujet est obligatoire.";
    if (!form.message.trim() || form.message.length < 20) e.message = "Le message doit contenir au moins 20 caractères.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Simulate async
    setStatus("success");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 5000);
  };

  const field = (id: keyof FormData, label: string, type = "text", required = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{ fontFamily: "Open Sans, sans-serif", fontWeight: 600, fontSize: 13, color: DARK }}>
        {label}{required && <span style={{ color: ORANGE }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        style={{
          padding: "12px 14px",
          borderRadius: 8,
          border: `1px solid ${errors[id] ? "#e74c3c" : "rgba(0,0,0,0.12)"}`,
          fontFamily: "Open Sans, sans-serif",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.2s",
          background: errors[id] ? "#fff5f5" : "#fff",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = ORANGE; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = errors[id] ? "#e74c3c" : "rgba(0,0,0,0.12)"; }}
        aria-required={required}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && <span id={`${id}-error`} style={{ color: "#e74c3c", fontFamily: "Open Sans, sans-serif", fontSize: 12 }}>{errors[id]}</span>}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} aria-label="Formulaire de contact" noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="contact-form-row">
        {field("name", "Nom complet", "text", true)}
        {field("email", "Adresse email", "email", true)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="contact-form-row">
        {field("phone", "Téléphone", "tel")}
        {field("subject", "Sujet", "text", true)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="message" style={{ fontFamily: "Open Sans, sans-serif", fontWeight: 600, fontSize: 13, color: DARK }}>
          Message <span style={{ color: ORANGE }}>*</span>
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={6}
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            border: `1px solid ${errors.message ? "#e74c3c" : "rgba(0,0,0,0.12)"}`,
            fontFamily: "Open Sans, sans-serif",
            fontSize: 14,
            resize: "vertical",
            outline: "none",
            background: errors.message ? "#fff5f5" : "#fff",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = ORANGE; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? "#e74c3c" : "rgba(0,0,0,0.12)"; }}
          aria-required
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <span id="message-error" style={{ color: "#e74c3c", fontFamily: "Open Sans, sans-serif", fontSize: 12 }}>{errors.message}</span>}
      </div>

      {status === "success" && (
        <div style={{ background: "#e8f5e9", border: "1px solid #81C784", borderRadius: 10, padding: "16px 20px", fontFamily: "Open Sans, sans-serif", color: "#2e7d32", fontSize: 14, fontWeight: 600 }}>
          ✓ Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h ouvrées.
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#fbe9e7", border: "1px solid #FF8A65", borderRadius: 10, padding: "16px 20px", fontFamily: "Open Sans, sans-serif", color: "#bf360c", fontSize: 14 }}>
          Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.
        </div>
      )}

      <button
        type="submit"
        style={{ padding: "15px 36px", background: ORANGE, color: "#fff", border: "none", borderRadius: 10, fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-start", transition: "opacity 0.2s" }}
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.25, ease: "power2.out" })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" })}
      >
        Envoyer le message →
      </button>
    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-hero]"), {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.15,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const el = infoRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const socials = [
    { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/IntegralProgressTech/" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/integral-progress-technology/" },
    { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/integralprogresstechnology/" },
    { Icon: Twitter, label: "X", href: "https://twitter.com/" },
    { Icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
  ];

  return (
    <div id="contact">
      {/* Hero */}
      <div ref={heroRef} style={{ background: DARK, color: "#fff", padding: "100px 80px 80px", textAlign: "center" }} className="contact-hero">
        <div data-hero style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontFamily: "Open Sans, sans-serif" }}>
          CONTACTEZ-NOUS
        </div>
        <h1 data-hero style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 1.15, maxWidth: 640, margin: "0 auto 20px" }}>
          Prêt À Échanger ?
        </h1>
        <p data-hero style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
          Contactez-nous pour organiser un audit gratuit de votre infrastructure IT et découvrir les solutions adaptées à votre entreprise.
        </p>
      </div>

      {/* Form + Info */}
      <div ref={infoRef} style={{ background: LIGHT_GRAY, padding: "80px 80px" }} className="contact-body">
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Form */}
          <div data-reveal style={{ flex: "1 1 500px", background: "#fff", borderRadius: 20, padding: "44px 40px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 26, color: DARK, marginBottom: 8 }}>Envoyez-nous un message</h2>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, marginBottom: 28 }}>
              Décrivez votre besoin et nous reviendrons vers vous sous 24h ouvrées.
            </p>
            <ContactFormFull />
          </div>

          {/* Info column */}
          <div style={{ flex: "0 1 320px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Coordonnées */}
            <div data-reveal style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 20 }}>Nos coordonnées</h3>
              {[
                { Icon: MapPin, text: "Av Allal Elfassi Centre Itrane, 3ème Étage N° 33 - Marrakech" },
                { Icon: Phone, text: "+212 (0) 688164547" },
                { Icon: Mail, text: "contact@integraltech.ma" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `rgba(230,126,34,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.Icon size={16} color={ORANGE} />
                  </div>
                  <span style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Horaires */}
            <div data-reveal style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Clock size={18} color={ORANGE} />
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: DARK, margin: 0 }}>Horaires d'ouverture</h3>
              </div>
              {[
                { jours: "Lundi – Vendredi", heure: "08h30 – 18h00" },
                { jours: "Samedi", heure: "09h00 – 13h00" },
                { jours: "Support urgent", heure: "24h/24 – 7j/7" },
              ].map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <span style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 13 }}>{h.jours}</span>
                  <span style={{ fontFamily: "Open Sans, sans-serif", color: DARK, fontSize: 13, fontWeight: 700 }}>{h.heure}</span>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div data-reveal style={{ background: NAVY, borderRadius: 16, overflow: "hidden", height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, boxShadow: "0 4px 18px rgba(0,0,0,0.12)" }}>
              <MapPin size={32} color={ORANGE} />
              <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center", margin: 0 }}>
                Av Allal Elfassi Centre Itrane, 3ème Étage N° 33 - Marrakech
              </p>
              <a
                href="https://maps.google.com/?q=Av+Allal+Elfassi+Centre+Itrane+Marrakech"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: ORANGE, fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 12, textDecoration: "none" }}
              >
                Voir sur Google Maps →
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div data-reveal style={{ background: "#fff", borderRadius: 16, padding: "24px 24px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 16 }}>Suivez-nous</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ width: 42, height: 42, borderRadius: 10, background: LIGHT_GRAY, display: "flex", alignItems: "center", justifyContent: "center", color: DARK, textDecoration: "none", transition: "background 0.2s" }}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { backgroundColor: ORANGE, color: "#fff", scale: 1.1, duration: 0.25, ease: "power2.out" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { backgroundColor: LIGHT_GRAY, scale: 1, duration: 0.25, ease: "power2.out" })}
                  >
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: "#fff", padding: "80px 80px" }} className="contact-faq">
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>FAQ</div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 36, color: DARK }}>Questions fréquentes</h2>
          </div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
