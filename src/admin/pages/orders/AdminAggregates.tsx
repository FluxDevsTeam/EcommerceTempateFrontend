import { useState, useEffect } from 'react';
import { FiShoppingBag, FiTruck, FiPackage } from "react-icons/fi";
import { fetchData } from './api';
import { Aggregate } from "./types";

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

  return (
    <div className='lg:mr-40'>
        <div className="flex gap-4 flex-wrap items-center border border-[#E6EDFF] rounded-2xl lg:p-6 p-2 lg:pr-12 mt-6">
            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:pr-10 pr-5">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.total_orders || 0}</h4>
                    <FiShoppingBag size={18} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Total Orders</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] lg:mr-2.5 mr-1">10.2</span>
                    <span className="lg:text-[14px] text-[10px]">+1.01% this week</span>
                </p> */}
            </div>

            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:px-5 px-2">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.delivered_orders || 0}</h4>
                    <FiShoppingBag size={20} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Delivered Orders</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] lg:mr-2.5 mr-1">10.2</span>
                    <span className="lg:text-[14px] text-[10px]">+1.01% this week</span>
                </p> */}
            </div>

            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:px-5 px-2">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.returned_orders || 0}</h4>
                    <FiPackage size={20} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Returned Orders</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] text-[#347AE2] lg:mr-2.5 mr-1">3.1</span>
                    <span className="lg:text-[14px] text-[10px]">+0.49% this week</span>
                </p> */}
            </div>

            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:px-5 px-2">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.pending_orders || 0}</h4>
                    <FiTruck size={20} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Pending Orders</p>
                {/* <p className="flex items-center">
                    <FiTrendingDown className="text-[#FF3B30] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] lg:mr-2.5 mr-1">2.56</span>
                    <span className="lg:text-[14px] text-[10px]">-0.91% this week</span>
                </p> */}
            </div>
        </div>

        <div className="flex gap-4 flex-wrap items-center border border-[#E6EDFF] rounded-2xl lg:p-6 p-2 lg:pr-12 mt-6">
            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:pr-10 pr-5">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.total_payment || 0}</h4>
                    <FiShoppingBag size={18} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Total Payment</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] lg:mr-2.5 mr-1">10.2</span>
                    <span className="lg:text-[14px] text-[10px]">+1.01% this week</span>
                </p> */}
            </div>

            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:px-5 px-2">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.successful_payment || 0}</h4>
                    <FiShoppingBag size={20} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Successful Payment</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] lg:lg:mr-2.5 mr-1">10.2</span>
                    <span className="lg:text-[14px] text-[10px]">+1.01% this week</span>
                </p> */}
            </div>

            <div className="border-r border-[#E6EDFF] basis-[40%] sm:basis-auto lg:px-5 px-2">
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h4 className="font-semibold text-[20px] lg:text-[28px]">{aggregate.refunded_payment || 0}</h4>
                    <FiPackage size={20} className="text-[#347AE2]" />
                </div>
                <p className="lg:font-medium text-[14px] sm:text-[18px]">Refunded Payment</p>
                {/* <p className="flex items-center">
                    <FiTrendingUp className="text-[#34C759] lg:lg:mr-2.5 mr-1" />
                    <span className="lg:text-[14px] text-[10px] text-[#347AE2] lg:mr-2.5 mr-1">3.1</span>
                    <span className="lg:text-[14px] text-[10px]">+0.49% this week</span>
                </p> */}
            </div>
        </div>
    </div>
)
}

export default AdminAggregates
