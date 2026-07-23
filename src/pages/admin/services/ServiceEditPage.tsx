import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../../services/adminService";
import ServiceForm from "../../../components/admin/services/ServiceForm";
import type { Service } from "../../../types/admin";
import { TEXT, TEXT_SECONDARY, BORDER, ACCENT } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const [service, setService] = useState<Service | null>(null);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError(false);
      setNotFound(false);
      const numId = Number(id);
      if (!numId || isNaN(numId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const [svc, allServices] = await Promise.all([
          adminService.getServiceById(numId, role),
          adminService.getServices(role),
        ]);
        if (!svc) {
          setNotFound(true);
        } else {
          setService(svc);
          setExistingSlugs(allServices.map((s) => s.slug));
        }
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, role, reloadToken]);

  if (loading) {
    return (
      <div role="status" aria-live="polite" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <div style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Chargement…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de charger ce service de démonstration.</span>
        <button type="button" onClick={() => setReloadToken((value) => value + 1)}>Réessayer</button>
      </div>
    );
  }

  if (notFound || !service) {
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
        <button type="button" onClick={() => navigate("/admin/services")}
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

  return <ServiceForm mode="edit" service={service} existingSlugs={existingSlugs} />;
}
