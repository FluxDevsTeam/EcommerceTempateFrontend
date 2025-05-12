import { useEffect, useState } from 'react';
import { DollarSign, Package, Users, CreditCard } from 'lucide-react';
import StatCard from './StatCard';
import axios from 'axios';

interface StatsData {
  total_available_products:string;
  total_payments_this_year: number;
  total_sales_this_year: number;
  total_users: number;
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
        
        if (response.data ) {
          setStats(response.data.data);
          console.log('stats:', response.data);
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
        title="Total Products Available" 
        value={`₦${stats.total_available_products.toLocaleString()}`} 
        icon={<DollarSign className="text-blue-500" />} 
     
      />
      <StatCard 
        title="Total Payments" 
        value={stats.total_payments_this_year} 
        icon={<Package className="text-blue-500" />} 
 
      />
      <StatCard 
        title="Total Sales" 
        value={stats.total_sales_this_year} 
        icon={<Users className="text-blue-500" />} 
   
      />
      <StatCard 
        title="Total Users" 
        value={stats.total_users} 
        icon={<CreditCard className="text-blue-500" />} 
    
      />
    </div>
  );
}