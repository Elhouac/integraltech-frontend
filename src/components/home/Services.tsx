import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { ShieldCheck, Cloud, Server, Zap, BarChart3, Layers } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG, LIGHT_GRAY } from "../../constants";

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTranslation();

  const services = [
    { icon: <ShieldCheck size={26} />, title: t.homeServices.cybersecurity, desc: t.homeServices.cybersecurityDesc },
    { icon: <Cloud size={26} />, title: t.homeServices.cloud, desc: t.homeServices.cloudDesc },
    { icon: <Server size={26} />, title: t.homeServices.erp, desc: t.homeServices.erpDesc },
    { icon: <Zap size={26} />, title: t.homeServices.support, desc: t.homeServices.supportDesc },
    { icon: <BarChart3 size={26} />, title: t.homeServices.bi, desc: t.homeServices.biDesc },
    { icon: <Layers size={26} />, title: t.homeServices.consulting, desc: t.homeServices.consultingDesc },
  ];

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      borderColor: "rgba(249, 115, 22, 0.3)",
      boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const iconVariants: Variants = {
    initial: { scale: 1, color: NAVY, backgroundColor: "rgba(30, 58, 138, 0.05)" },
    hover: {
      scale: 1.08,
      color: "#FFFFFF",
      backgroundColor: ORANGE,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  const accentVariants: Variants = {
    initial: { scaleX: 0 },
    hover: {
      scaleX: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };


  return (
    <section
      ref={ref}
      className="services-section"
      style={{
        padding: "100px 0",
        background: LIGHT_GRAY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial accent glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30, 58, 138, 0.03) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Block */}
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
            {t.homeServices.badge}
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
              marginBottom: 16,
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            {t.homeServices.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "Open Sans, sans-serif",
              color: BODY_TEXT,
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 640,
              margin: "16px auto 0",
            }}
          >
            {t.homeServices.description}
          </motion.p>
        </div>

        {/* Services Responsive Grid */}
        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{
            display: "grid",
            gap: 32,
          }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover="hover"
              style={{
                background: CARD_BG,
                borderRadius: "16px",
                padding: "40px 32px",
                border: `1px solid ${BORDER}`,
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              {/* Top Accent Line */}
              <motion.div
                variants={accentVariants}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: ORANGE,
                  transformOrigin: "left",
                }}
              />

              <div style={{ width: "100%" }}>
                {/* Micro-interactive Icon */}
                <motion.div
                  variants={iconVariants}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  {s.icon}
                </motion.div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: DARK,
                    marginBottom: 12,
                    marginTop: 0,
                  }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "Open Sans, sans-serif",
                    color: BODY_TEXT,
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>

              {/* CTA Link */}
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: ORANGE,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  marginTop: 28,
                  fontFamily: "Outfit, sans-serif",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = NAVY;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = ORANGE;
                }}
                onClick={(e) => e.preventDefault()} // Keep original behavior
              >
                {t.homeServices.learnMore}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}