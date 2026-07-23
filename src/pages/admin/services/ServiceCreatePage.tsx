import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
import ServiceForm from "../../../components/admin/services/ServiceForm";
import { useAuth } from "../../../context/AuthContext";

export default function ServiceCreatePage() {
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    adminService.getServices(role)
      .then((services) => {
        if (active) setExistingSlugs(services.map((service) => service.slug));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [role, reloadToken]);

  if (loading) {
    return <div role="status" aria-live="polite" style={{ color: "var(--muted)" }}>Chargement…</div>;
  }

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de préparer la création du service de démonstration.</span>
        <button type="button" onClick={() => setReloadToken((value) => value + 1)}>Réessayer</button>
      </div>
    );
  }

  return <ServiceForm mode="create" existingSlugs={existingSlugs} />;
}
