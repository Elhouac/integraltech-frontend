import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
import SolutionForm from "../../../components/admin/solutions/SolutionForm";

export default function SolutionCreatePage() {
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  useEffect(() => {
    adminService.getSolutions().then((solutions) => {
      setExistingSlugs(solutions.map((s) => s.slug));
    });
  }, []);

  return <SolutionForm mode="create" existingSlugs={existingSlugs} />;
}
