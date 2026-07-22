import { CalendarDays } from "lucide-react";
import type { AnalyticsDateRange, AnalyticsFilterOption } from "../../../types/admin";

interface AnalyticsDateRangeFilterProps {
  value: AnalyticsDateRange;
  options: AnalyticsFilterOption[];
  onChange: (value: AnalyticsDateRange) => void;
  disabled?: boolean;
}

export default function AnalyticsDateRangeFilter({
  value,
  options,
  onChange,
  disabled = false,
}: AnalyticsDateRangeFilterProps) {
  return (
    <label className="admin-analytics-range-filter">
      <span>
        <CalendarDays size={15} aria-hidden="true" />
        Période analysée
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AnalyticsDateRange)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
