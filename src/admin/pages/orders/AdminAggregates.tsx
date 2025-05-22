import { useState, useEffect } from 'react';
import { FiShoppingBag, FiTruck, FiPackage, FiDollarSign, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { fetchData } from './api';
import { Aggregate } from "./types";
import { formatNumberWithCommas, formatCurrency } from "../../utils/formatting";

const AdminAggregates = () => {
    const [aggregate, setAggregate] = useState<Aggregate>({
        total_orders: 0,
        returned_orders: 0,
        delivered_orders: 0,
        pending_orders: 0,
        total_payment: 0,
        successful_payment: 0,
        refunded_payment: 0,
    });

    useEffect(() => {
        const getOrders = async () => {
        try {
            const data = await fetchData();
            setAggregate(data.aggregate);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
        };

        getOrders();
    }, []);

    const statItems = [
      { title: "Total Orders", value: formatNumberWithCommas(aggregate.total_orders || 0), icon: FiShoppingBag, color: "blue" },
      { title: "Delivered Orders", value: formatNumberWithCommas(aggregate.delivered_orders || 0), icon: FiTruck, color: "green" },
      { title: "Returned Orders", value: formatNumberWithCommas(aggregate.returned_orders || 0), icon: FiPackage, color: "orange" },
      { title: "Pending Orders", value: formatNumberWithCommas(aggregate.pending_orders || 0), icon: FiRefreshCw, color: "yellow" },
    ];

    const paymentItems = [
      { title: "Total Payment", value: formatCurrency(aggregate.total_payment || 0), icon: FiDollarSign, color: "purple" },
      { title: "Successful Payment", value: formatCurrency(aggregate.successful_payment || 0), icon: FiCheckCircle, color: "teal" },
      { title: "Refunded Payment", value: formatCurrency(aggregate.refunded_payment || 0), icon: FiRefreshCw, color: "red" },
    ];
    
    const iconColorClasses: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      yellow: "bg-yellow-100 text-yellow-600",
      purple: "bg-purple-100 text-purple-600",
      teal: "bg-teal-100 text-teal-600",
      red: "bg-red-100 text-red-600",
    };

  return (
    <div className='mt-4 space-y-3'>
        {/* Order Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {statItems.map(item => (
                <div key={item.title} className="bg-white p-2 sm:p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex items-center space-x-2">
                    <div className={`p-1.5 rounded-full ${iconColorClasses[item.color]}`}>
                        <item.icon size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500">{item.title}</p>
                        <h4 className="text-lg font-semibold text-gray-700">{item.value}</h4>
                    </div>
                </div>
            ))}
        </div>

        {/* Payment Stats - now 3 items, will naturally flow on grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {paymentItems.map(item => (
                <div key={item.title} className="bg-white p-2 sm:p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex items-center space-x-2">
                     <div className={`p-1.5 rounded-full ${iconColorClasses[item.color]}`}>
                        <item.icon size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500">{item.title}</p>
                        <h4 className="text-lg font-semibold text-gray-700">{item.value}</h4>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AdminAggregates;
