import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const OrderAnalytics = () => {
  const [orderPeriod, setOrderPeriod] = useState('Monthly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        if (response.data && response.data.data && response.data.data.monthly_data) {
          // Transform monthly data into required format for Recharts
          const transformedData = response.data.data.monthly_data.map((monthData: any) => ({
            month: monthData.month,
            orders: monthData.total,
          }));
          setChartData(transformedData);
        } else {
          setChartData([]);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data.');
        
        // Optional: Handle 401 unauthorized errors
        if (err.response?.status === 401) {
          // You might want to redirect to login or refresh the token here
          console.log('Unauthorized - redirecting to login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow px-6 py-8 mb-8 flex justify-center items-center h-64">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow px-6 py-8 mb-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-lg shadow px-6 py-8 mb-8">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow px-6 mb-8">
      <div className="md:flex-row flex flex-col justify-between items-center space-y-2 md:space-y-0 mb-4">
        <h2 className="text-xl font-bold">Orders Analytics</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">Successful Orders</span>
          </div>
          {/* <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              {orderPeriod}
              <ChevronDown size={16} />
            </button>
          </div> */}
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 'dataMax + 100']} // Adjust domain to fit your data
              ticks={[0, 20, 40, 60, 80, 100]} // Custom ticks based on your data range
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderAnalytics;