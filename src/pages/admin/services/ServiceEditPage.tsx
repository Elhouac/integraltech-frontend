import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../../services/adminService";
import ServiceForm from "../../../components/admin/services/ServiceForm";
import type { Service } from "../../../types/admin";
import { TEXT, TEXT_SECONDARY, BORDER, ACCENT } from "../../../constants";

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const numId = Number(id);
      if (!numId || isNaN(numId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const [svc, allServices] = await Promise.all([
        adminService.getServiceById(numId),
        adminService.getServices(),
      ]);

      if (!svc) {
        setNotFound(true);
      } else {
        setService(svc);
        setExistingSlugs(allServices.map((s) => s.slug));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <div style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Chargement…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: 400, gap: 16, textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: `${ACCENT}15`, fontSize: 28, color: ACCENT,
        }}>
          ?
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
          Service introuvable
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", maxWidth: 400 }}>
          Le service demandé n'existe pas ou a été supprimé.
        </p>
        <button onClick={() => navigate("/admin/services")}
          style={{
            marginTop: 8, padding: "10px 24px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`,
            background: "transparent", color: TEXT, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          Retour aux services
        </button>
      </div>
    );
  }

  return <ServiceForm mode="edit" service={service!} existingSlugs={existingSlugs} />;
}
