import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to: string;
  isCurrent: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="hidden md:block text-sm text-gray-600 mb-4 md:mb-6">
      <ol className="list-none p-0 inline-flex items-center space-x-1.5">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight size={14} className="text-gray-400 mx-1" />}
            {item.isCurrent ? (
              <span className="font-medium text-gray-800">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 