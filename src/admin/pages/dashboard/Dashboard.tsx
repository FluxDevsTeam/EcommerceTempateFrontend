import OrderAnalytics from './components/OrderAnalytics';
import StatsCard from './components/StatsCard';
import OrdersList from './OrdersList';



export default function Dashboard() {

 

  return (
    <div className=" min-h-screen">


      <div className=" w-full flex justify-between items-center px-4 mb-6">
        
       
               <h1 className="md:text-2xl text-lg font-bold">Welcome Back, Marci</h1>
               <div className="flex gap-4">
                 <button className="p-2 rounded-full bg-white shadow">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="11" cy="11" r="8"></circle>
                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                   </svg>
                 </button>
                 <button className="p-2 rounded-full bg-white shadow">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                     <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                   </svg>
                 </button>
               </div>
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

