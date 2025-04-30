import OrderAnalytics from './components/OrderAnalytics';
import StatsCard from './components/StatsCard';
import OrdersList from './OrdersList';
import AdminHeader from '@/admin/components/AdminHeader';


export default function Dashboard() {

 

  return (
    <div className=" min-h-screen">

      <AdminHeader />
      
      
      <p className="text-gray-500 mb-6">Here is the information about all your orders</p>
      
      {/* Stats Cards */}
    <StatsCard/>
      
      {/* Orders Analytics */}
     <OrderAnalytics/>
      
      {/* Order List */}
    <OrdersList/>
    </div>
  );
}

