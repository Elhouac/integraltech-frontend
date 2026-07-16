import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { trustData } from "../../data/homeData";
import SectionHeader from "../ui/SectionHeader";
import TrustCard from "../ui/TrustCard";
import { useTranslation } from "../../context/LanguageContext";

// i18n lookup (fully replaced in Batch 6)

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function WhyChooseUs() {
  const t = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="why-choose-us-section"
      style={{
        padding: "100px 0",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          transform: "translateY(-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
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
          badge={t.whyChooseUs.badge}
          title={t.whyChooseUs.title}
          subtitle={t.whyChooseUs.subtitle}
        />

        <motion.div
          className="trust-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {trustData.map((item) => (
            <TrustCard
              key={item.titleKey}
              icon={item.icon}
              title={t.whyChooseUs[item.titleKey as keyof typeof t.whyChooseUs] ?? item.titleKey}
              description={t.whyChooseUs[item.descKey as keyof typeof t.whyChooseUs] ?? item.descKey}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
