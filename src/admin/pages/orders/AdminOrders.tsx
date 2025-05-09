import { useState, useEffect } from 'react';
import { FiMenu, FiGrid } from "react-icons/fi";
import AdminHeaders from './AdminHeaders';
import AdminAggregates from './AdminAggregates';
import Dropdown from "./Dropdown";
import { fetchData } from './api';
import { Order } from "./types";
import formatEstimatedDelivery from "./Date";
import Pagination from './Pagination';
import SearchInput from './SearchForm';
import SelectedOrderPopup from './SelectedOrder';
import { PatchOrderStatus } from './api';


const AdminOrders = () => {
  const [layout, setLayout] = useState("menu");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Categories");
  const [isOpen, setIsOpen] = useState(false);;

const statusColors: { [key: string]: { dot: string; bg: string } } = {
  PAID: { dot: "#4CAF50", bg: "#4CAF5026" },
  SHIPPED: { dot: "#2196F3", bg: "#2196F326" },
  DELIVERED: { dot: "#9C27B0", bg: "#9C27B026" },
  CANCELLED: { dot: "#F44336", bg: "#F4433626" },
};



  const filteredOrders = statusFilter === "All Categories"
  ? orders
  : orders.filter((order) => order.status === statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedOrders = filteredOrders.slice(startIndex, endIndex);

  const handleSearchItemSelect = (): void => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchData();
        const normalizedResults = data.results.map((order: Order) => ({
          ...order,
          status: order.status.toUpperCase()
        }));
        setOrders(normalizedResults);
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
      <div className="flex gap-1.5 sm:gap-5 items-center mt-10 w-full">
      <div className='basis-auto w-[160px] sm:basis-[35%] sm:w-auto sm:mr-auto'>
          <SearchInput onItemSelect={handleSearchItemSelect} />
        </div>
        <div>
          <Dropdown
            label="Sort by"
            options={["All Categories", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]}
            onSelect={(value) => setStatusFilter(value)}
          />
        </div>
        <div
          className={`p-2 rounded-lg cursor-pointer ${layout === "menu" ? "bg-black" : "border border-[#CACACA]"}`}
          onClick={() => setLayout("menu")}
        >
          <FiMenu className={`${layout === "menu" ? "text-white" : "text-black"} sm:w-[24px] w-[12px] sm:h-[24px] h-[12px]`} />
        </div>

        <div
          className={`p-2 rounded-lg cursor-pointer ${layout === "grid" ? "bg-black" : "border border-[#CACACA]"}`}
          onClick={() => setLayout("grid")}
        >
          <FiGrid className={`${layout === "grid" ? "text-white" : "text-black"} sm:w-[24px] w-[16px] sm:h-[24px] h-[16px]`} />
        </div>
      </div>

      {/* Menu View */}
      {layout === "menu" && (
        <div className="mt-10 border border-[#E6EDFF] rounded-2xl sm:py-4 py-2 sm:px-6 px-2">
          <ul className="text-[12px] font-semibold flex sm:py-5 py-2 border-b border-[#E6EDFF]">
            <li className="sm:w-[10%] w-[15%]">ID</li>
            <li className="sm:w-[10%] w-[30%]">Date</li>
            <li className="sm:w-[20%] w-[40%]">Product Name</li>
            <li className="w-[20%] hidden sm:block">Address</li>
            <li className="sm:w-[10%] w-[15%]">Price</li>
            <li className="w-[20%] hidden sm:block">Est. Delivery</li>
            <li className="w-[10%] hidden sm:block">Status</li>
          </ul>
          <ul>
          {displayedOrders.map((order) => {
            const statusData = statusColors[order.status] || { dot: "#000", bg: "#fff" }; // Fallback value

            return (
              <li key={order.id} className="text-[10px] sm:text-[12px] font-medium flex py-5 border-b border-[#E6EDFF] cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <p className="sm:w-[10%] w-[15%]">{order.id.slice(0, 6)}</p>
                <p className="sm:w-[10%] w-[30%]">{new Date(order.order_date).toLocaleDateString()}</p>
                <p className="sm:w-[20%] w-[40%]">{order.order_items.map(item => item.name).join(', ')}</p>
                <p className="w-[20%] hidden sm:block">{order.delivery_address}</p>
                <p className="sm:w-[10%] w-[15%]">
                  ₦{order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee)}
                </p>
                <p className="w-[20%] text-[12px] hidden sm:block">{formatEstimatedDelivery(order.estimated_delivery)}</p>
                <p className={`items-center gap-3 w-[120px] px-4 py-1 hidden sm:flex rounded-lg`} style={{ backgroundColor: statusData.bg }}>
                  <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusData.dot }}></span>
                  <span className="">{order.status}</span>
                </p>
              </li>
            );
          })}
          </ul>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 sm:mb-16 mt-10">
          {filteredOrders.map((order) => {
            const firstItem = order.order_items[0]; // get first item in order
            const imageSrc = firstItem?.product?.image1
            const statusData = statusColors[order.status] || { dot: "#000", bg: "#fff" }; // Fallback value

            return (
              <div key={order.id} className="mb-10" onClick={() => setSelectedOrder(order)}>
                <div className="relative w-fit mb-4">
                  <p className={`absolute top-2 right-2 flex items-center px-3 rounded-md gap-2`} style={{ backgroundColor: statusData.bg }}>
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusData.dot }}></span>
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
          onStatusChange={async (newStatus) => {
          if (selectedOrder) {
            const upperStatus = newStatus.toUpperCase();
            try {
              await PatchOrderStatus(selectedOrder.id, upperStatus);

              const updatedOrders = orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: upperStatus } : order
              );
              setOrders(updatedOrders);
              setSelectedOrder({ ...selectedOrder, status: upperStatus });
              } catch (error) {
                console.error("Failed to update order status in backend:", error);
                alert("Failed to change status")
              }
            }
          }}
        />
      )}


    </div>
  );
};

export default AdminOrders;