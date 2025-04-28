import { useEffect, useState } from 'react';
import { DollarSign, Package, Users, CreditCard } from 'lucide-react';
import StatCard from './StatCard';
import axios from 'axios';

interface StatsData {
  total_orders: number;
  delivered_orders: number;
  pending_orders: number;
  returned_orders: number;
  refunded_payment: number;
  successful_payment: number;
  total_payment: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/admin/');
        if (response.data && response.data.aggregate) {
          setStats(response.data.aggregate);
        } else {
          setStats(null);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return <p>No stats found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Sales" 
        value={`₦${stats.total_payment.toLocaleString()}`} 
        icon={<DollarSign className="text-blue-500" />} 
        change={10.2} 
        changeText="+1.01% this week" 
        changeType="positive" 
      />
      <StatCard 
        title="Total Orders" 
        value={stats.total_orders.toString()} 
        icon={<Package className="text-blue-500" />} 
        change={3.1} 
        changeText="+0.49% this week" 
        changeType="positive" 
      />
      <StatCard 
        title="Pending Orders" 
        value={stats.pending_orders.toString()} 
        icon={<Users className="text-blue-500" />} 
        change={-0.91} 
        changeText="-0.91% this week" 
        changeType="negative" 
      />
      <StatCard 
        title="Delivered Orders" 
        value={stats.delivered_orders.toString()} 
        icon={<CreditCard className="text-blue-500" />} 
        change={1.51} 
        changeText="+1.51% this week" 
        changeType="positive" 
      />
    </div>
  );
}
