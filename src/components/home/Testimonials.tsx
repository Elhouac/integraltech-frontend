import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG, LIGHT_GRAY } from "../../constants";

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Directeur IT, CMA CGM Maroc",
      text: "IntegralTech a transformé notre infrastructure IT. Leur expertise en cybersécurité nous a permis de sécuriser nos données critiques.",
    },
    {
      name: "Fatima Zahra",
      role: "DG, Cabinet Conseil",
      text: "Un partenaire de confiance pour notre migration cloud. L'équipe est réactive et compétente, toujours disponible.",
    },
    {
      name: "Karim Mansouri",
      role: "CEO, StartupMA",
      text: "Leur solution ERP a optimisé nos processus de 40%. Un retour sur investissement rapide et mesurable.",
    },
  ];

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="testimonials-section"
      style={{
        padding: "100px 0",
        background: LIGHT_GRAY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "90%", maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              color: ORANGE,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            TÉMOIGNAGES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 40px)",
              color: DARK,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Ce Que Disent Nos Clients
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow:
                  "0 20px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
                transition: { duration: 0.25 },
              }}
              style={{
                background: CARD_BG,
                borderRadius: "16px",
                padding: "36px 32px",
                border: `1px solid ${BORDER}`,
                boxShadow: "var(--shadow-sm)",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Quote icon */}
              <div>
                <div
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: ORANGE,
                    fontFamily: "Georgia, serif",
                    marginBottom: 16,
                    opacity: 0.6,
                  }}
                >
                  "
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontFamily: "Open Sans, sans-serif",
                    color: BODY_TEXT,
                    fontSize: 15,
                    lineHeight: 1.8,
                    marginBottom: 28,
                    fontStyle: "italic",
                    margin: "0 0 28px",
                  }}
                >
                  {t.text}
                </p>
              </div>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderTop: `1px solid ${BORDER}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Outfit, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: DARK,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "Open Sans, sans-serif",
                      fontSize: 13,
                      color: BODY_TEXT,
                      marginTop: 2,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}