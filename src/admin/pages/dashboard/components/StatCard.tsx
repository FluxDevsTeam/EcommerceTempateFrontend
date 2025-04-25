import {ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  changeText: string;
  changeType: 'positive' | 'negative';
}

export default function StatCard({ title, value, icon, change, changeText, changeType }:StatCardProps ){
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{value}</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-gray-600 mb-2">{title}</div>
      <div className="flex items-center">
        <div className={`flex items-center mr-2 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
          {changeType === 'positive' ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
          <span className="ml-1">{change}</span>
        </div>
        <span className="text-gray-500 text-sm">{changeText}</span>
      </div>
    </div>
  );
}
