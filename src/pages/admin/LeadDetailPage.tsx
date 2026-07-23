import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Calendar, User, Tag } from "lucide-react";
import LeadStatusBadge from "../../components/admin/leads/LeadStatusBadge";
import LeadNotes from "../../components/admin/leads/LeadNotes";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import type { LeadStatus, LeadNote, Lead } from "../../types/admin";
import { LEAD_STATUS_CONFIG } from "../../data/admin-mocks";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../constants";
import { hasPermission } from "../../utils/permissions";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const canEdit = user ? hasPermission(user.role, "leads", "edit") : false;

  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadStatus>("new");
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadLeadData() {
      setIsLoading(true);
      setLoadError(false);
      try {
        const leadId = Number(id);
        const [leadRes, notesRes] = await Promise.all([
          adminService.getLeadById(leadId, role),
          adminService.getLeadNotes(leadId, role),
        ]);
        if (active) {
          if (leadRes) {
            setLead(leadRes);
            setStatus(leadRes.status);
            setNotes(notesRes);
            if (!leadRes.is_read && user && canEdit) {
              await adminService.markLeadAsRead(leadId, user.role);
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadLeadData();
    return () => { active = false; };
  }, [id, user, canEdit, role, reloadToken]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!user || !canEdit) return;
    try {
      setStatus(newStatus);
      await adminService.updateLeadStatus(Number(id), newStatus, user.role);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!user || !canEdit) return;
    try {
      const newNote = await adminService.addLeadNote(Number(id), user.name, content, user.role);
      setNotes((prev) => [...prev, newNote]);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div role="status" aria-live="polite" style={{ padding: 40, color: TEXT_SECONDARY }}>Chargement du lead...</div>;
  }

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de charger ce lead de démonstration.</span>
        <button type="button" onClick={() => setReloadToken((value) => value + 1)}>Réessayer</button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: "var(--font-display)" }}>
          Lead introuvable
        </h2>
        <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 8, fontFamily: "var(--font-sans)" }}>
          Le lead demandé n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => navigate("/admin/leads")}
          style={{
            marginTop: 16,
            padding: "8px 20px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: ACCENT,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Retour aux leads
        </button>
      </div>
    );
  }

  const infoItems = [
    { icon: Mail, label: "Email", value: lead.email },
    { icon: Phone, label: "Téléphone", value: lead.phone || "Non renseigné" },
    { icon: Tag, label: "Sujet", value: lead.subject },
    { icon: Calendar, label: "Reçu le", value: formatDate(lead.created_at) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Back + Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate("/admin/leads")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: TEXT_SECONDARY,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            padding: 0,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} />
          Retour aux leads
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                color: TEXT,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <User size={20} color={ACCENT} />
              {lead.name}
            </h1>
          </div>

          {/* Status change */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LeadStatusBadge status={status} />
            {canEdit && (
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                aria-label="Changer le statut"
                style={{
                  padding: "6px 28px 6px 10px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "var(--radius-sm)",
                  background: SURFACE,
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Info Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Info grid */}
        <div
          className="admin-lead-info-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            background: BORDER,
          }}
        >
          {infoItems.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px 20px",
                background: SURFACE,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <item.icon size={15} color="var(--muted)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, fontFamily: "var(--font-sans)", marginTop: 2 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div style={{ padding: "20px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            Message
          </div>
          <p
            style={{
              fontSize: 14,
              color: TEXT,
              fontFamily: "var(--font-sans)",
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {lead.message}
          </p>
        </div>
      </motion.div>

      {/* ── Notes ── */}
      {canEdit && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <LeadNotes notes={notes} onAddNote={handleAddNote} />
        </motion.div>
      )}
    </div>
  );
}
