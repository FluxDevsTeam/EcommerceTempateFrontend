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
        // Get the JWT token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/dashboard/',
          {
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.data && response.data.aggregate) {
          setStats(response.data.aggregate);
        } else {
          setStats(null);
        }
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch statistics.');
        
        // Optional: Handle 401 unauthorized errors
        if (err.response?.status === 401) {
          // You might want to redirect to login or refresh the token here
          console.log('Unauthorized - redirecting to login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-32">
      <p>Loading stats...</p>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      <p>Error: {error}</p>
    </div>;
  }

  if (!stats) {
    return <div className="p-4">
      <p>No stats available</p>
    </div>;
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