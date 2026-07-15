import { Download } from "lucide-react";
import { BORDER, SURFACE, TEXT } from "../../../constants";
import type { Lead } from "../../../types/admin";

interface LeadExportButtonProps {
  leads: Lead[];
}

export default function LeadExportButton({ leads }: LeadExportButtonProps) {
  const handleExport = () => {
    const escapeCsv = (val: unknown): string => {
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = ["ID", "Nom", "Email", "Téléphone", "Sujet", "Statut", "Date"];
    const rows = leads.map((l) => [
      l.id,
      l.name,
      l.email,
      l.phone || "",
      l.subject,
      l.status,
      new Date(l.created_at).toLocaleDateString("fr-FR"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      aria-label="Exporter en CSV"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        border: `1px solid ${BORDER}`,
        borderRadius: "var(--radius-md)",
        background: SURFACE,
        color: TEXT,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        transition: "background 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      <Download size={14} />
      Export CSV
    </button>
  );
}
