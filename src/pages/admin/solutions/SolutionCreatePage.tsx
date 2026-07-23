import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
import SolutionForm from "../../../components/admin/solutions/SolutionForm";
import { useAuth } from "../../../context/AuthContext";

export default function SolutionCreatePage() {
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
    adminService.getSolutions(role)
      .then((solutions) => {
        if (active) setExistingSlugs(solutions.map((solution) => solution.slug));
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
        <span>Impossible de préparer la création de la solution de démonstration.</span>
        <button type="button" onClick={() => setReloadToken((value) => value + 1)}>Réessayer</button>
      </div>
    );
  }

  return <SolutionForm mode="create" existingSlugs={existingSlugs} />;
}
