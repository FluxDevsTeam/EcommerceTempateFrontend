import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  badge?: number;
  className?: string;
  onClick: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
}

export default function NavItem({
  icon,
  label,
  to,
  active,
  badge,
  className,
  onClick,
  isCollapsed,
}: NavItemProps) {
  return (
    <div title={isCollapsed ? label : undefined} className="relative">
      <Link
        to={to}
        className={`
          flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all 
          hover:bg-white hover:text-black
          ${active ? "bg-white !text-black" : ""}
          ${className || ""}
          ${isCollapsed ? "justify-center" : ""}
        `}
        onClick={onClick}
      >
        <span className={`${active ? "text-black" : ""}`}>{icon}</span>
        {!isCollapsed && (
          <span
            className={`text-base font-medium ${active ? "text-black" : ""}`}
          >
            {label}
          </span>
        )}
        {badge && !isCollapsed && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </Link>
    </div>
  );
}
