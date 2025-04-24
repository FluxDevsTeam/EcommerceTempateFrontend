import { useState, useEffect } from 'react';
import { FiShoppingBag, FiTruck, FiPackage, FiTrendingUp, FiTrendingDown, FiMenu, FiGrid } from "react-icons/fi";
import search from './img/shape.png';
import notis from './img/bell.png';
import Dropdown from "./Dropdown";
import { fetchData } from './api';
import { Order, Aggregate } from "./types";
import formatEstimatedDelivery from "./Date";
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
// import Pagination from './Pagination';

const AdminOrders = () => {
  const [layout, setLayout] = useState("menu");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [aggregate, setAggregate] = useState<Aggregate>({
    total_orders: 0,
    returned_orders: 0,
    delivered_orders: 0
  });

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchData();
        setOrders(data.results);
        setAggregate(data.aggregate);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="leading-[150%] relative">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="font-medium text-[28px] mb-2.5">Product Orders</h2>
          <p className="text-base text-[#7C8DB5]">Here is the information about all your orders</p>
        </div>
        <div className="flex items-start gap-4">
          <img src={search} className="w-[24px]" alt="search" />
          <img src={notis} className="w-[24px]" alt="notification" />
        </div>
      </div>

      {/* Aggregate Section */}
      <div className="flex justify-between items-center w-[75%] border border-[#E6EDFF] rounded-2xl p-6 mt-6">
        <div className="w-[33%] border-r border-[#E6EDFF] pr-10">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px]">{aggregate.total_orders || 0}</h4>
            <FiShoppingBag size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Total Orders</p>
          <p className="flex items-center">
            <FiTrendingUp className="text-[#34C759] mr-2.5" />
            <span className="text-[14px] mr-2.5">10.2</span>
            <span className="text-[14px]">+1.01% this week</span>
          </p>
        </div>

        <div className="w-[33%] border-r border-[#E6EDFF] px-5">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px]">{aggregate.returned_orders || 0}</h4>
            <FiPackage size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Cancelled Orders</p>
          <p className="flex items-center">
            <FiTrendingUp className="text-[#34C759] mr-2.5" />
            <span className="text-[14px] text-[#7C8DB5] mr-2.5">3.1</span>
            <span className="text-[14px]">+0.49% this week</span>
          </p>
        </div>

        <div className="w-[33%] pl-5">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px]">{aggregate.delivered_orders || 0}</h4>
            <FiTruck size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Total Delivered</p>
          <p className="flex items-center">
            <FiTrendingDown className="text-[#FF3B30] mr-2.5" />
            <span className="text-[14px] mr-2.5">2.56</span>
            <span className="text-[14px]">-0.91% this week</span>
          </p>
        </div>
      </div>

      {/* Layout Controls */}
      <div className="flex items-center gap-8 mt-10">
        <form className="flex items-center gap-4 px-4 py-2.5 border border-[#CACACA] rounded-lg mr-auto">
          <img src={search} alt="search" className="h-[18px] w-[18px]" />
          <input type="text" placeholder="Search" className="focus:outline-none" />
        </form>
        <Dropdown
          label="All Categories"
          options={["Active", "Delivered"]}
          widthClass="w-50"
          onSelect={(value) => console.log("Selected:", value)}
        />
        <div className="bg-black p-2 rounded-lg cursor-pointer" onClick={() => setLayout("menu")}>
          <FiMenu className="text-white w-[24px] h-[24px]" />
        </div>
        <div className="p-2 border border-[#CACACA] rounded-lg cursor-pointer" onClick={() => setLayout("grid")}>
          <FiGrid className="w-[24px] h-[24px]" />
        </div>
      </div>

      {/* Menu View */}
      {layout === "menu" && (
        <div className="MENU mt-10 border border-[#E6EDFF] rounded-2xl py-4 px-6">
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
            {orders.map((order) => (
              <li key={order.id} className="text-[12px] font-semibold flex py-5 border-b border-[#E6EDFF] cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <p className="w-[10%]">{order.id.slice(0, 6)}</p>
                <p className="w-[10%]">{new Date(order.order_date).toLocaleDateString()}</p>
                <p className="w-[20%]">{order.order_items.map(item => item.name).join(', ')}</p>
                <p className="w-[20%]">{order.delivery_address}</p>
                <p className="w-[10%]">
                  ₦{order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee)}
                </p>
                <p className='w-[20%] text-[12px]'>{formatEstimatedDelivery(order.estimated_delivery)}</p>
                <p className="w-[10%] bg-[#34C75926] pl-3 flex items-center gap-2 py-1 rounded-lg">
                  <span className="block rounded-full w-2 h-2 bg-[#34C759]"></span>
                  <span>{order.status}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {layout === 'grid' && (
        <div className="GRID grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 sm:mb-16 mt-10">
          {orders.map((order) => {
            const firstItem = order.order_items[0]; // get first item in order
            const imageSrc = firstItem?.product?.image1

            return (
              <div key={order.id} className="mb-10">
                <div className="relative w-fit mb-4">
                  <p className={`absolute top-2 right-2 ${order.status === "Delivered" ? "bg-[#34C75926]" : "bg-[#FF950026]"} flex items-center gap-2 rounded-lg px-4`}>
                    <span className={`block rounded-full w-2 h-2 ${order.status === "Delivered" ? "bg-[#34C759]" : "bg-[#FF9500]"}`}></span>
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

      <div className='flex justify-between items-center px-24 mt-20'>
         <Pagination />
         <Link to={""} className='text-[#184455] font-semibold'>Next</Link>
      </div>

      {selectedOrder && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm flex justify-center items-start z-50 pt-20">
          <div className="bg-white w-[80%] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <div className='flex justify-between items-center mb-3 '>
              <h3 className="text-[18px] font-medium">Order {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="mb-4 text-red-500 font-bold text-[25px]">X</button>
            </div>

            <p className="text-[14px] mb-4 font-medium">
              Placed on {new Date(selectedOrder.order_date).toLocaleDateString()} by {selectedOrder.first_name} {selectedOrder.last_name}
            </p>

            <p className="text-[14px] font-semibold mb-3">Customer’s Details</p>
            <div className="grid grid-cols-3 gap-y-3">
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">First Name:</span><span>{selectedOrder.first_name}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">Last Name:</span><span>{selectedOrder.last_name}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">Delivery Address:</span><span>{selectedOrder.delivery_address}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">Email:</span><span>{selectedOrder.email}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">City/Region:</span><span>{selectedOrder.state}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">Estimated Delivery:</span><span>{formatEstimatedDelivery(selectedOrder.estimated_delivery)}</span></p>
              <p className="flex items-center gap-3 text-[14px]"><span className="font-medium">Phone Number:</span><span>{selectedOrder.phone_number}</span></p>
            </div>

            <div className="mt-10 flex justify-between items-center">
              <div>
                <p className="text-[14px] font-medium">Status</p>
                <Dropdown
                  label="Status"
                  options={["Active", "Delivered"]}
                  widthClass="w-40"
                  menuBgClass="bg-[#34C75926]"
                  onSelect={(value) => console.log("Selected:", value)}
                />
              </div>
              <div className="text-[14px]">
                <p className="font-medium">Total Delivery Fee</p>
                <p className="font-bold">₦{parseFloat(selectedOrder.delivery_fee).toLocaleString()}</p>
              </div>
            </div>

            <div className="text-[#333333] text-[14px] mt-10">
              <p className="flex items-center bg-[#DADADA80] text-[#333333] font-medium p-4 rounded-lg">
                <span className="w-[25%]">Products</span>
                <span className="w-[25%]">Quantity</span>
                <span className="w-[25%]">Price</span>
                <span className="w-[25%]">Total</span>
              </p>

              {selectedOrder.order_items.map((item, index) => (
                <p key={index} className="flex items-center text-[#333333] font-medium py-3 rounded-lg mt-4">
                  <span className="w-[25%]">{item.name}</span>
                  <span className="w-[25%]">{item.quantity}</span>
                  <span className="w-[25%]">₦{parseFloat(item.price).toLocaleString()}</span>
                  <span className="w-[25%]">₦{(item.quantity * parseFloat(item.price)).toLocaleString()}</span>
                </p>
              ))}

              <p className="flex items-center justify-end text-[#333333] font-bold py-3 rounded-lg mt-4">
                <span className="w-[25%]">Subtotal</span>
                <span className="w-[25%]">₦{selectedOrder.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;