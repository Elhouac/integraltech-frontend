import { memo } from "react";

export interface StatusBadgeVariant {
  label: string;
  color: string;
  bg: string;
}

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  size?: "sm" | "md";
}

function StatusBadgeComponent({ variant, size = "md" }: StatusBadgeProps) {
  const isSmall = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? 4 : 6,
        padding: isSmall ? "2px 8px" : "4px 10px",
        borderRadius: 999,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        color: variant.color,
        background: variant.bg,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: "50%",
          background: variant.color,
          flexShrink: 0,
        }}
      />
      {variant.label}
    </span>
  );
}

const StatusBadge = memo(StatusBadgeComponent);
export default StatusBadge;
