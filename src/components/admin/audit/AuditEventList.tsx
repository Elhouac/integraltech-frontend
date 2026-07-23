import React from "react";
import AuditEventItem from "./AuditEventItem";
import type { AdminAuditEvent } from "../../../types/admin";
import { BORDER, SURFACE, TEXT_SECONDARY, TEXT } from "../../../constants";

interface AuditEventListProps {
  events: AdminAuditEvent[];
  onViewDetails: (event: AdminAuditEvent) => void;
  showActor?: boolean;
}

export default function AuditEventList({ events, onViewDetails, showActor = true }: AuditEventListProps) {
  if (events.length === 0) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, marginBottom: 6 }}>
          Aucun événement d'audit trouvé
        </div>
        <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Aucun enregistrement ne correspond aux critères de recherche ou au filtre de périmètre.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-audit-table-wrapper">
      <table className="admin-audit-table">
        <thead>
          <tr>
            <th scope="col">Événement</th>
            {showActor && <th scope="col">Acteur</th>}
            <th scope="col">Action</th>
            <th scope="col">Ressource</th>
            <th scope="col">Résultat & Sévérité</th>
            <th scope="col">Source</th>
            <th scope="col" style={{ textAlign: "right" }}>Détails</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <AuditEventItem
              key={event.id}
              event={event}
              onViewDetails={onViewDetails}
              showActor={showActor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
