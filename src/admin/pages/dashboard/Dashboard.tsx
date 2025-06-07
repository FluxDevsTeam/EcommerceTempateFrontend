import OrderAnalytics from './components/OrderAnalytics';
import StatsCard from './components/StatsCard';
import OrdersList from './OrdersList';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col gap-3 p-4 pt-0 md:p-6 bg-gray-50 mt-0">
      <div className="w-full flex justify-between items-center px-3 mb-2 mt-0">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mt-0 ">Welcome Back, Admin</h1>
      </div>
      
      {/* Stats Cards */}
      <StatsCard />
      
      {/* Orders Analytics */}
      <OrderAnalytics />
      
      {/* Order List */}
      <OrdersList />
    </div>
  );
}

