import { useRef } from "react";
import { motion, useInView } from "framer-motion";
const ORANGE = "#E67E22";
const NAVY = "#34568B";
const DARK = "#2C3E50";
const LIGHT_GRAY = "#F4F6F8";
export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const testimonials = [
    { name: "Ahmed Benali", role: "Directeur IT, CMA CGM Maroc", text: "IntegralTech a transformé notre infrastructure IT. Leur expertise en cybersécurité nous a permis de sécuriser nos données critiques." },
    { name: "Fatima Zahra", role: "DG, Cabinet Conseil", text: "Un partenaire de confiance pour notre migration cloud. L'équipe est réactive et compétente, toujours disponible." },
    { name: "Karim Mansouri", role: "CEO, StartupMA", text: "Leur solution ERP a optimisé nos processus de 40%. Un retour sur investissement rapide et mesurable." },
  ];
  return (
    <section ref={ref} className="testimonials-section" style={{ padding: "80px 80px", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}
        >
          TÉMOIGNAGES
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 40, color: DARK }}
        >
          Ce Que Disent Nos Clients
        </motion.h2>
      </div>
      <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.12 }}
            whileHover={{ y: -5, boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }}
            style={{ background: LIGHT_GRAY, borderRadius: 12, padding: "36px 28px", cursor: "default" }}
          >
            <div style={{ color: ORANGE, fontSize: 40, marginBottom: 16, lineHeight: 1 }}>"</div>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: "#4a5568", fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>{t.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                {t.name[0]}
              </div>
              <div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: DARK }}>{t.name}</div>
                <div style={{ fontFamily: "Open Sans, sans-serif", fontSize: 12, color: "#6C7A89" }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}