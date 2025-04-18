import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

// const statusConfig = {
//   'open': {
//     label: 'Open',
//     className: 'bg-status-open/20 text-status-open ring-1 ring-status-open/30', // Add appropriate color classes
//   },
//   'in-progress': {
//     label: 'In Progress',
//     className: 'bg-status-in-progress/20 text-status-in-progress ring-1 ring-status-in-progress/30', // Update with colors
//   },
//   'review': {
//     label: 'Under Review',
//     className: 'bg-status-review/20 text-status-review ring-1 ring-status-review/30', // Update with colors
//   },
//   'rejected': {
//     label: 'Rejected',
//     className: 'bg-status-rejected/20 text-status-rejected ring-1 ring-status-rejected/30', // Update with colors
//   },
//   'resolved': {
//     label: 'Resolved',
//     className: 'bg-status-resolved/20 text-status-resolved ring-1 ring-status-resolved/30', // Update with colors
//   },
// };
const statusConfig = {
  open: {
    label: "Open",
    className: "bg-yellow-100 text-yellow-800",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800",
  },
  review: {
    label: "Under Review",
    className: "bg-purple-100 text-purple-800",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
};

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || {
    label: "Unknown",
    className: "bg-gray-300 text-black",
  };

  return (
    <Badge 
      className={cn(config.className, className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
}

