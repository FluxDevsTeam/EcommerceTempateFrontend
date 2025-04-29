import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrderAnalytics = () => {
  const [orderPeriod, setOrderPeriod] = useState('Monthly');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/admin-dashboard/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // Transform monthly data into required format for Recharts
        const transformedData = data.data.monthly_data.map(monthData => ({
          month: monthData.month,
          orders: monthData.total,
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures fetch runs once on component mount

  return (
    <div className="bg-white rounded-lg shadow px-6 mb-8">
      <div className="md:flex-row flex flex-col justify-between items-center space-y-2 md:space-y-0 mb-4">
        <h2 className="text-xl font-bold">Orders Analytics</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">Successful Orders</span>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              {orderPeriod}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Assuming you want to display the latest date and total sales */}
      <div className="mb-2">
        <div className="text-xs">{/* Insert date here */}</div>
        <div className="font-bold text-lg">{/* Insert total sales here */}</div>
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
