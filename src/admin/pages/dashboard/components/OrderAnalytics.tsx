import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { formatNumberWithCommas } from '../../../utils/formatting';

// Helper function for formatting Y-axis ticks
const formatYAxisTick = (tickValue: number): string => {
  if (tickValue === 0) return '0';

  if (tickValue >= 1000000) return `${formatNumberWithCommas(Math.round(tickValue / 100000) * 100000 / 1000)}K`; // e.g. 1.2M -> 1200K
  if (tickValue >= 10000) return `${formatNumberWithCommas(Math.round(tickValue / 1000))}K`; // e.g. 12,345 -> 12K
  if (tickValue >= 1000) return formatNumberWithCommas(Math.round(tickValue / 100) * 100); // e.g. 1234 -> 1200
  if (tickValue >= 100) return formatNumberWithCommas(Math.round(tickValue / 10) * 10); // e.g. 123 -> 120
  
  return formatNumberWithCommas(tickValue); // For smaller numbers or as a fallback
};

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
      <div className="bg-white rounded-xl shadow-lg px-6 py-8 mb-8 flex justify-center items-center h-72">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg px-6 py-8 mb-8 text-red-600">
        <p className="font-medium">Error loading analytics:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg px-6 py-8 mb-8">
        <p className="text-gray-500">No analytics data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Order Trends</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></div>
            <span className="text-[11px] text-gray-600">Monthly Orders</span>
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
      <div className="h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              domain={[
                0, 
                (dataMax: number) => {
                  if (dataMax < 50 && dataMax > 0) return 50; // Ensure a minimum sensible top if data is very low but not zero
                  if (dataMax === 0) return 100; // If all data is zero, set a default top like 100
                  return Math.ceil((dataMax + dataMax * 0.1) / 10) * 10; // Add 10% buffer, round to nearest 10
                }
              ]}
              tickFormatter={formatYAxisTick} // Use the new formatter
              dx={-5}
              // allowDecimals={false} // Ensure whole numbers for ticks if not using K/M suffixes
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                padding: '8px 12px',
              }}
              itemStyle={{ color: '#4b5563'}}
              labelStyle={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}
              formatter={(value: number, name: string) => [
                `${formatNumberWithCommas(value)} orders`,
                null // No name for the item
              ]}
              // Custom content for more control if needed, but formatter should suffice
              // content={({ active, payload, label }) => {
              //   if (active && payload && payload.length) {
              //     return (
              //       <div className="custom-tooltip bg-white p-2.5 border border-gray-200 rounded-xl shadow-lg text-xs">
              //         <p className="label font-semibold text-gray-700 mb-1">{`${label}`}</p>
              //         <p className="intro text-orange-600">{`Orders: ${formatNumberWithCommas(payload[0].value as number)}`}</p>
              //       </div>
              //     );
              //   }
              //   return null;
              // }}
            />
            <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderAnalytics;