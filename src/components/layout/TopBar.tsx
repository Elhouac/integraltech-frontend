import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const DARK = "#2C3E50";

export default function TopBar() {
  return (
    <motion.div
      className="topbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: DARK,
        color: "#fff",
        fontSize: 13,
        padding: "8px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={14} />
          <span>+212 (0) 688164547</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={14} />
          <span>Av Allal Elfassi Centre Itrane, 3ème Étage N° 33 - Marrakech</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={14} />
          <span>contact@integraltech.ma</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} />
          <span>Lundi-Vendredi : 09:00am - 17:30pm / Samedi : 09:00am - 13:00pm</span>
        </div>
      </div>
    </motion.div>
  );
}