import { useEffect, useState } from 'react';
import { DollarSign, Package, Users, CreditCard, TrendingUp, AlertCircle, Loader2, Banknote } from 'lucide-react';
import StatCard from './StatCard';
import axios from 'axios';
import { formatNumberWithCommas, formatCurrency } from '../../../utils/formatting';

interface StatsData {
  data: {
    total_available_products: string;
    total_payments_this_year: number;
    total_sales_this_year: number;
    total_users: number;
    monthly_data: Array<{
      month: string;
      total: number;
    }>;
  }
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
          'https://api.kidsdesigncompany.com/api/v1/admin/dashboard/',
          {
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between h-40 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6 mb-6 flex items-center gap-4">
        <AlertCircle className="text-red-500 h-8 w-8" />
        <div>
          <p className="font-semibold text-red-700">Error loading statistics:</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <p className="text-gray-500">No statistics available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 mt-0 lg:grid-cols-4 gap-2 md:gap-4 mb-2">
      <StatCard 
        title="Total Products"
        value={formatNumberWithCommas(parseInt(stats.data.total_available_products))} 
        icon={<Package className="text-indigo-500" />} 
        description="Available in stock"
      />

      <StatCard 
        title="Total Payments"
        value={formatCurrency(stats.data.total_payments_this_year)} 
        icon={<Banknote className="text-emerald-500" />} 
        description="This fiscal year"
      />
      <StatCard 
        title="Total Sales"
        value={formatNumberWithCommas(stats.data.total_sales_this_year)} 
        icon={<TrendingUp className="text-amber-500" />} 
        description="All-time sales count"
      />
      <StatCard 
        title="Total Users"
        value={formatNumberWithCommas(stats.data.total_users)} 
        icon={<Users className="text-sky-500" />} 
        description="Registered platform users"
      />
    </div>
  );
}