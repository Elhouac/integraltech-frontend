import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
import ServiceForm from "../../../components/admin/services/ServiceForm";

export default function ServiceCreatePage() {
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  useEffect(() => {
    adminService.getServices().then((services) => {
      setExistingSlugs(services.map((s) => s.slug));
    });
  }, []);

  return <ServiceForm mode="create" existingSlugs={existingSlugs} />;
}
