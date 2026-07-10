import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Cloud, Server, Zap, BarChart3, Layers } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

const ORANGE = "#E67E22";
const DARK = "#2C3E50";
const LIGHT_GRAY = "#F4F6F8";

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTranslation();

  const services = [
    { icon: <ShieldCheck size={30} />, title: t.homeServices.cybersecurity, desc: t.homeServices.cybersecurityDesc },
    { icon: <Cloud size={30} />, title: t.homeServices.cloud, desc: t.homeServices.cloudDesc },
    { icon: <Server size={30} />, title: t.homeServices.erp, desc: t.homeServices.erpDesc },
    { icon: <Zap size={30} />, title: t.homeServices.support, desc: t.homeServices.supportDesc },
    { icon: <BarChart3 size={30} />, title: t.homeServices.bi, desc: t.homeServices.biDesc },
    { icon: <Layers size={30} />, title: t.homeServices.consulting, desc: t.homeServices.consultingDesc },
  ];
  return (
    <section ref={ref} className="services-section" style={{ padding: "80px 80px", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}
        >
          {t.homeServices.badge}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 40, color: DARK, marginBottom: 16 }}
        >
          {t.homeServices.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, maxWidth: 600, margin: "0 auto" }}
        >
          {t.homeServices.description}
        </motion.p>
      </div>
      <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -6, boxShadow: `0 12px 32px rgba(230,126,34,0.15)`, borderBottom: `4px solid ${ORANGE}` }}
            style={{ background: LIGHT_GRAY, borderRadius: 12, padding: "36px 28px", borderBottom: "4px solid transparent", cursor: "pointer" }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 20, color: DARK, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ORANGE, fontWeight: 700, fontSize: 13, textDecoration: "none", marginTop: 20, fontFamily: "Open Sans, sans-serif" }}>
              {t.homeServices.learnMore}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}