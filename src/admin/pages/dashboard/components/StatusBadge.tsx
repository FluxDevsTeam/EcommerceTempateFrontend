import React from "react";

type StatusType = "On Delivery" | "Active";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseStyle =
    "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-max";

  const statusMap: Record<StatusType, string> = {
    "On Delivery": "bg-orange-100 text-orange-700",
    "Active": "bg-green-100 text-green-700",
  };

  const dotColor: Record<StatusType, string> = {
    "On Delivery": "bg-orange-500",
    "Active": "bg-green-500",
  };

  const appliedStatusMap = statusMap[status as StatusType] ?? "bg-gray-100 text-gray-700";
  const appliedDotColor = dotColor[status as StatusType] ?? "bg-gray-500";

  return (
    <span className={`${baseStyle} ${appliedStatusMap}`}>
      <span className={`h-2 w-2 rounded-full ${appliedDotColor}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
