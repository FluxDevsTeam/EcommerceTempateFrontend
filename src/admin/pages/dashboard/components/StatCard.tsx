import {ArrowUp, ArrowDown } from 'lucide-react';
import { formatNumberWithCommas } from '../../../utils/formatting';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: number;
  changeText: string;
  changeType: 'positive' | 'negative';
}

export default function StatCard({ title, value, icon, change, changeText, changeType }:StatCardProps ){
  const displayValue = typeof value === 'string' && value.startsWith('₦') 
    ? value
    : formatNumberWithCommas(value);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{displayValue}</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-gray-600 mb-2">{title}</div>
      <div className="flex items-center">
       

      </div>
    </div>
  );
}
