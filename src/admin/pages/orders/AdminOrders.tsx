import { useState, useEffect } from 'react';
import { FiMenu, FiGrid } from "react-icons/fi";
import AdminHeaders from './AdminHeaders';
import AdminAggregates from './AdminAggregates';
import Dropdown from "./Dropdown";
import { fetchData } from './api';
import { Order } from "./types";
import formatEstimatedDelivery from "./Date";
import Pagination from './Pagination';
import SearchForm from './SearchForm';
import SelectedOrderPopup from './SelectedOrder';


const AdminOrders = () => {
  const [layout, setLayout] = useState("menu");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Categories");

  const statusColors: { [key: string]: { dot: string; bg: string } } = {
    Paid: { dot: "#4CAF50", bg: "#4CAF5026" },
    Shipped: { dot: "#2196F3", bg: "#2196F326" },
    Delivered: { dot: "#9C27B0", bg: "#9C27B026" },
    Cancelled: { dot: "#F44336", bg: "#F4433626" },
    Refunded: { dot: "#FF9800", bg: "#FF980026" },
  };

  const filteredOrders = statusFilter === "All Categories"
  ? orders
  : orders.filter((order) => order.status === statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedOrders = filteredOrders.slice(startIndex, endIndex);
  



  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchData();
        setOrders(data.results);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="leading-[150%] relative">
      <AdminHeaders />
      <AdminAggregates />
      <div className="flex items-center mt-10">
        <div className='basis-[]'>
          <SearchForm />
        </div>
        <div>
          <Dropdown
            label="All Categories"
            options={["All Categories", "Paid", "Shipped", "Delivered", "Cancelled", "Refunded"]}
            widthClass="w-50"
            onSelect={(value) => setStatusFilter(value)}
          />
        </div>
        <div
          className={`p-2 rounded-lg cursor-pointer ${layout === "menu" ? "bg-black" : "border border-[#CACACA]"}`}
          onClick={() => setLayout("menu")}
        >
          <FiMenu className={`${layout === "menu" ? "text-white" : "text-black"} w-[24px] h-[24px]`} />
        </div>

        <div
          className={`p-2 rounded-lg cursor-pointer ${layout === "grid" ? "bg-black" : "border border-[#CACACA]"}`}
          onClick={() => setLayout("grid")}
        >
          <FiGrid className={`${layout === "grid" ? "text-white" : "text-black"} w-[24px] h-[24px]`} />
        </div>
      </div>

      {/* Menu View */}
      {layout === "menu" && (
        <div className="mt-10 border border-[#E6EDFF] rounded-2xl py-4 px-6">
          <ul className="text-[12px] font-semibold flex py-5 border-b border-[#E6EDFF]">
            <li className="w-[10%]">ID</li>
            <li className="w-[10%]">Date</li>
            <li className="w-[20%]">Product Name</li>
            <li className="w-[20%]">Address</li>
            <li className="w-[10%]">Price</li>
            <li className="w-[20%]">Est. Delivery</li>
            <li className="w-[10%]">Status</li>
          </ul>
          <ul>
          {displayedOrders.map((order) => (
              <li key={order.id} className="text-[12px] font-semibold flex py-5 border-b border-[#E6EDFF] cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <p className="w-[10%]">{order.id.slice(0, 6)}</p>
                <p className="w-[10%]">{new Date(order.order_date).toLocaleDateString()}</p>
                <p className="w-[20%]">{order.order_items.map(item => item.name).join(', ')}</p>
                <p className="w-[20%]">{order.delivery_address}</p>
                <p className="w-[10%]">
                  ₦{order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee)}
                </p>
                <p className='w-[20%] text-[12px]'>{formatEstimatedDelivery(order.estimated_delivery)}</p>
                <p className={`flex items-center gap-4 px-6 py-1 rounded-lg`} style={{ backgroundColor: statusColors[order.status].bg }}>
                  <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusColors[order.status].dot }}></span>
                  <span className="capitalize">{order.status}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 sm:mb-16 mt-10">
          {filteredOrders.map((order) => {
            const firstItem = order.order_items[0]; // get first item in order
            const imageSrc = firstItem?.product?.image1

            return (
              <div key={order.id} className="mb-10" onClick={() => setSelectedOrder(order)}>
                <div className="relative w-fit mb-4">
                  <p className={`absolute top-2 right-2 flex items-center gap-2`} style={{ backgroundColor: statusColors[order.status].bg }}>
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusColors[order.status].dot }}></span>
                    <span className="text-[12px]">{order.status}</span>
                  </p>
                  <img src={imageSrc} alt={firstItem?.name || 'Product'} className="rounded-3xl w-full" />
                </div>
                <p className="text-base sm:text-[20px] mb-2">
                  {order.order_items.map(item => item.name).join(", ")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[20px] sm:text-[20px]">
                    ₦{order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee)}
                  </span>
                  <span className="text-[16px] text-[#00000066] line-through">
                    ₦{parseFloat(order.delivery_fee)}
                  </span>
                  <span className="bg-[#72D3E940] text-[10px] sm:text-[14px] rounded-3xl py-0.5 px-6">Total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />


      {selectedOrder && (
        <SelectedOrderPopup
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}


    </div>
  );
};

export default AdminOrders;