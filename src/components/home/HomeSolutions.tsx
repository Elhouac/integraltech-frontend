import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { solutionsData } from "../../data/homeData";
import SectionHeader from "../ui/SectionHeader";
import SolutionCard from "../ui/SolutionCard";
import { useTranslation } from "../../context/LanguageContext";

// i18n lookup (fully replaced in Batch 6)

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

export default function HomeSolutions() {
  const t = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="home-solutions-section"
      style={{
        padding: "100px 0",
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          badge={t.homeSolutions.badge}
          title={t.homeSolutions.title}
          subtitle={t.homeSolutions.subtitle}
        />

        <motion.div
          className="solutions-home-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {solutionsData.map((s) => (
            <SolutionCard
              key={s.titleKey}
              icon={s.icon}
              title={t.homeSolutions[s.titleKey as keyof typeof t.homeSolutions] ?? s.titleKey}
              description={t.homeSolutions[s.descKey as keyof typeof t.homeSolutions] ?? s.descKey}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
