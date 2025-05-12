import OrderAnalytics from './components/OrderAnalytics';
import StatsCard from './components/StatsCard';
import OrdersList from './OrdersList';



export default function Dashboard() {

 

  return (
    <div className=" min-h-screen">


      <div className=" w-full flex justify-between items-center px-4 mb-6">
        
       
               <h1 className="md:text-2xl text-lg font-bold">Welcome Back, Admin</h1>
              
      </div>
      
      
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

