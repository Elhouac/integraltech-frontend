import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "../../context/LanguageContext";

const ORANGE = "#E67E22";
const NAVY = "#34568B";


function useCountUp(target: number, duration = 1.8, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}



 function StatItem({ value, suffix, label, delay, trigger }: { value: number; suffix: string; label: string; delay: number; trigger: boolean }) {
  const count = useCountUp(value, 1.6, trigger);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ textAlign: "center" }}
    >
      <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 32, color: ORANGE }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "Open Sans, sans-serif", fontSize: 13, color: "#fff", opacity: 0.9 }}>{label}</div>
    </motion.div>
  );
}


 function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslation();
  const stats = [
    { value: 500, suffix: "+", label: t.stats.clients },
    { value: 10, suffix: "+", label: t.stats.experience },
    { value: 50, suffix: "+", label: t.stats.experts },
    { value: 24, suffix: "/7", label: t.stats.support },
  ];
  return (
    <div ref={ref} className="statsbar" style={{ background: NAVY, padding: "28px 80px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
      {stats.map((s, i) => (
        <StatItem key={i} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} trigger={inView} />
      ))}
    </div>
  );
}
export default StatsBar;