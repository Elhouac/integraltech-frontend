import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Zap, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG, LIGHT_GRAY } from "../../constants";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTranslation();

  const features = [
    { icon: <CheckCircle size={22} />, title: t.homeAbout.excellence, desc: t.homeAbout.excellenceDesc, color: NAVY },
    { icon: <Zap size={22} />, title: t.homeAbout.innovation, desc: t.homeAbout.innovationDesc, color: ORANGE },
    { icon: <ShieldCheck size={22} />, title: t.homeAbout.security, desc: t.homeAbout.securityDesc, color: "#22C55E" },
    { icon: <BarChart3 size={22} />, title: t.homeAbout.growth, desc: t.homeAbout.growthDesc, color: "#8B5CF6" },
  ];

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 24, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="about-section"
      style={{
        background: CARD_BG,
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          gap: 80,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Left Column — Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ flex: "1 1 400px", minWidth: 320 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(30, 58, 138, 0.06)",
              border: "1px solid rgba(30, 58, 138, 0.12)",
              color: NAVY,
              padding: "6px 14px",
              borderRadius: "99px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "Outfit, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 20,
            }}
          >
            À PROPOS DE NOUS
          </div>

          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              color: DARK,
              marginBottom: 20,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              margin: "0 0 20px",
            }}
          >
            Votre Partenaire Digital De Confiance
          </h2>

          <p
            style={{
              fontFamily: "Open Sans, sans-serif",
              color: BODY_TEXT,
              fontSize: 16,
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Depuis plus de 10 ans, IntegralTech accompagne les entreprises marocaines dans leur
            transformation numérique.
          </p>
          <p
            style={{
              fontFamily: "Open Sans, sans-serif",
              color: BODY_TEXT,
              fontSize: 16,
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            Nous croyons en un partenariat durable, fondé sur la confiance, l'expertise et
            l'innovation continue.
          </p>

          <NavLink
            to="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: ORANGE,
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(249, 115, 22, 0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(249, 115, 22, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(249, 115, 22, 0.2)";
            }}
          >
            {t.common.learnMore}
            <ArrowRight size={16} />
          </NavLink>
        </motion.div>

        {/* Right Column — Feature Cards */}
        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{
            flex: "1 1 400px",
            minWidth: 320,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
                transition: { duration: 0.25 },
              }}
              style={{
                background: LIGHT_GRAY,
                borderRadius: "14px",
                padding: "28px 22px",
                border: `1px solid ${BORDER}`,
                cursor: "default",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${item.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "10px",
                  background: `${item.color}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  marginBottom: 16,
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: DARK,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  color: BODY_TEXT,
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
