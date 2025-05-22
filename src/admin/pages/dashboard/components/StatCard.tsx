import React from 'react';
import { formatNumberWithCommas } from '../../../utils/formatting';

interface IconProps {
  className?: string;
  size?: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement<IconProps>; // Specify that icon is a ReactElement that accepts IconProps
  description?: string; // Optional description
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
  const displayValue = typeof value === 'string' && (value.startsWith('₦') || value.includes(','))
    ? value
    : formatNumberWithCommas(value);

  // Extract the icon's original color class to reapply it or use a default
  const originalIconClassName = icon.props.className || 'text-gray-600'; // Default if no class

  return (
    <div className="bg-white p-3.5 rounded-lg shadow-md flex flex-col justify-between min-h-[100px] transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-medium text-gray-500 mb-0.5 truncate" title={title}>{title}</h3>
          <p className="text-lg font-bold text-gray-700 truncate" title={String(displayValue)}>{displayValue}</p>
        </div>
        <div className={`ml-2 p-1.5 rounded-full flex items-center justify-center 
                        ${originalIconClassName.includes('indigo') ? 'bg-indigo-100 text-indigo-600' : 
                          originalIconClassName.includes('emerald') ? 'bg-emerald-100 text-emerald-600' : 
                          originalIconClassName.includes('amber') ? 'bg-amber-100 text-amber-600' : 
                          originalIconClassName.includes('sky') ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-600'}`}>
          {React.cloneElement(icon, { 
            size: 18,
            // className is managed by the parent div for color, originalIconClassName is used for logic only
          })}
        </div>
      </div>
      {description && (
        <p className="text-[11px] text-gray-400 mt-1 truncate" title={description}>{description}</p>
      )}
    </div>
  );
}
