import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  open: {
    label: "Open",
    className: "bg-status-open/20 text-status-open ring-1 ring-status-open/30", // Add appropriate color classes
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-status-in-progress/20 text-status-in-progress ring-1 ring-status-in-progress/30", // Update with colors
  },
  review: {
    label: "Under Review",
    className:
      "bg-status-review/20 text-status-review ring-1 ring-status-review/30", // Update with colors
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-status-rejected/20 text-status-rejected ring-1 ring-status-rejected/30", // Update with colors
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-status-resolved/20 text-status-resolved ring-1 ring-status-resolved/30", // Update with colors
  },
};

export function StatusBadge({ status, className }) {
  const config = statusConfig[status];

  return (
    <Badge
      className={cn(config.className, className)} // Combines with any additional custom className passed
      variant="outline"
    >
      {config.label}
    </Badge>
  );
}
