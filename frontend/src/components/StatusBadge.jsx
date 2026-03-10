import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    locked: "bg-gray-400",
    in_progress: "bg-yellow-500",
    passed: "bg-green-600",
    failed: "bg-red-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
