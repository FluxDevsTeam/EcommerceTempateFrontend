import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseStyle =
    "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-max capitalize";

  // Normalize status to lowercase for consistent key matching
  const normalizedStatus = status.toLowerCase();

  let styleClasses = {
    bg: "bg-gray-100",
    text: "text-gray-800",
    dot: "bg-gray-500",
  };

  switch (normalizedStatus) {
    case "pending":
      styleClasses = { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" };
      break;
    case "shipped":
    case "on delivery": // Group "on delivery" with "shipped"
      styleClasses = { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" };
      break;
    case "delivered":
    case "active": // Group "active" with "delivered"
      styleClasses = { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" };
      break;
    case "cancelled":
      styleClasses = { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" };
      break;
    // Default case is already set
  }

  return (
    <span className={`${baseStyle} ${styleClasses.bg} ${styleClasses.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${styleClasses.dot}`}></span>
      {status} {/* Display original status for correct casing */}
    </span>
  );
};

export default StatusBadge;
