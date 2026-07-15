import { memo } from "react";
import StatusBadge from "../shared/StatusBadge";
import { LEAD_STATUS_CONFIG } from "../../../data/admin-mocks";
import type { LeadStatus } from "../../../types/admin";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
}

function LeadStatusBadgeComponent({ status, size }: LeadStatusBadgeProps) {
  return <StatusBadge variant={LEAD_STATUS_CONFIG[status]} size={size} />;
}

const LeadStatusBadge = memo(LeadStatusBadgeComponent);
export default LeadStatusBadge;
