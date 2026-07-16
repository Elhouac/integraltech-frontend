import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { testimonialsData } from "../../data/homeData";
import SectionHeader from "../ui/SectionHeader";
import { useTranslation } from "../../context/LanguageContext";

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// i18n lookup (fully replaced in Batch 6)

export default function Testimonials() {
  const t = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="testimonials-section"
      style={{
        padding: "100px 0",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "90%", maxWidth: 1320, margin: "0 auto" }}>
        <SectionHeader
          badge={t.testimonials.badge}
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
        />

        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}
        >
          {testimonialsData.map((tItem, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: "36px 32px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Quote block */}
              <div>
                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    marginBottom: 16,
                    color: "var(--accent)",
                    fontSize: 16,
                  }}
                >
                  {"★★★★★"}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--text-secondary)",
                    fontSize: 15,
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    margin: "0 0 28px",
                  }}
                >
                  "{t.testimonials[tItem.textKey as keyof typeof t.testimonials] ?? tItem.textKey}"
                </p>
              </div>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "var(--font-display)",
                    flexShrink: 0,
                  }}
                >
                  {tItem.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text)",
                    }}
                  >
                    {tItem.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {tItem.role}
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