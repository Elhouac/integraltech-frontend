import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { servicesData } from "../../data/servicesData";
import SectionHeader from "../ui/SectionHeader";
import ServiceCard from "../ui/ServiceCard";
import { useTranslation } from "../../context/LanguageContext";

// i18n lookup (fully replaced in Batch 6)

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

export default function Services() {
  const t = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="services-section"
      style={{
        padding: "100px 0",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
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
          maxWidth: 1320,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <SectionHeader
          badge={t.homeServices.badge}
          title={t.homeServices.title}
          subtitle={t.homeServices.description}
        />

        <motion.div
          className="services-home-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {servicesData.map((s) => (
            <ServiceCard
              key={s.titleKey}
              icon={s.icon}
              title={t.services[s.titleKey as keyof typeof t.services] ?? s.titleKey}
              description={t.services[s.descKey as keyof typeof t.services] ?? s.descKey}
              href={s.href}
              ctaLabel={t.servicesPage?.request ?? "Demander"}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}