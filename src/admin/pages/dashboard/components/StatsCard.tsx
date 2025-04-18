import {DollarSign, Package, Users, CreditCard } from 'lucide-react';
import StatCard from './StatCard';


export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Sales" 
        value="89,935" 
        icon={<DollarSign className="text-blue-500" />} 
        change={10.2} 
        changeText="+1.01% this week" 
        changeType="positive" 
      />
      <StatCard 
        title="Total products" 
        value="23,283.5" 
        icon={<Package className="text-blue-500" />} 
        change={3.1} 
        changeText="+0.49% this week" 
        changeType="positive" 
      />
      <StatCard 
        title="Total users" 
        value="46,827" 
        icon={<Users className="text-blue-500" />} 
        change={2.56} 
        changeText="-0.91% this week" 
        changeType="negative" 
      />
      <StatCard 
        title="Total Payments" 
        value="#124,854" 
        icon={<CreditCard className="text-blue-500" />} 
        change={7.2} 
        changeText="+1.51% this week" 
        changeType="positive" 
      />
    </div>
  );
}