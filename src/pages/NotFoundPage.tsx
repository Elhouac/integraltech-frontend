import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../constants";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "var(--font-sans)",
        background: "var(--background)",
        color: TEXT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          padding: "48px 32px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.08)",
            marginBottom: 24,
          }}
        >
          <AlertCircle size={32} color="var(--danger)" />
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: TEXT,
            margin: "0 0 12px 0",
          }}
        >
          Page Introuvable
        </h1>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: TEXT_SECONDARY,
            margin: "0 0 32px 0",
          }}
        >
          Désolé, la page que vous recherchez n'existe pas, a été déplacée ou est temporairement indisponible.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 24px",
              background: ACCENT,
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              cursor: "pointer",
              transition: "transform 0.15s, opacity 0.15s",
            }}
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 24px",
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              color: TEXT,
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <ArrowLeft size={16} />
            Page précédente
          </button>
        </div>
      </motion.div>
    </div>
  );
}
