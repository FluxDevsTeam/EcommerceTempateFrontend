import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { fetchData } from "./api";
import { Link } from "react-router-dom";
import type { OrderData, OrderItem } from './types';
import formatEstimatedDelivery from "./Date";
import Pagination from "./Pagination";

const Order = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  const getPageUrl = (page: number) => `https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/?page=${page}`;
  
  const loadOrders = async (url?: string) => {
    try {
      setLoading(true);
      const data = await fetchData(url);
      const urlParams = new URLSearchParams(url?.split('?')[1]);
      const page = parseInt(urlParams.get("page") || "1", 10);
  
      // 👇 Update the URL in the browser
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("page", page.toString());
      window.history.pushState({}, "", newUrl.toString());
  
      setOrders(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 10));

      if (!data || !Array.isArray(data.results)) {
          setError("Invalid data received.");
        }

    } catch (err) {
     console.error("Error fetching customers:", err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
  };
  
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get("page") || "1", 10);
      loadOrders(getPageUrl(page));
    }, []);
  

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-14 pb-10 sm:pb-28">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">My Orders</h2>

      {orders.map((order: OrderData) => (
        <div key={order.id} className="mb-14">
          <h4 className="text-[#344054] font-bold text-[16px] sm:text-[25px] mb-6">Order ID: {order.id}</h4>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
            <p className="flex gap-2 items-center">
              <span className="text-[#667085] text-sm leading-5">Order date:</span>
              <span className="text-[#1D2939]">{order.order_date}</span>
            </p>
            <p className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faCalendar} className="text-black w-5" />
              <span>Estimated Delivery: {formatEstimatedDelivery(order.estimated_delivery)}</span>
            </p>
          </div>

          <div className="mb-4 flex flex-col">
            {/* <span className="text-[20px] inline-block leading-[30px] mb-2">Status</span> */}
            <span className="bg-[#72D3E940] inline-block rounded-2xl pl-2 py-1 w-[150px]">{order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}</span>
          </div>

          <ul className="flex flex-col gap-6 sm:gap-3">
            {order.order_items.map((item: OrderItem) => (
              <li key={item.id} className="flex flex-wrap items-center gap-5 sm:gap-20 p-4 rounded-xl">
                <div className="bg-[#F0EEED] max-w-[120px] sm:max-w-[200px] rounded-2xl overflow-hidden">
                  <img src={item.image1} className="w-[400px]" alt={item.name} />
                </div>
                <div className="basis-[40%] sm:basis-[30%]">
                  <p className="text-base sm:text-2xl leading-8 mb-2 line-clamp-2">{item.name}</p>
                  <p className="leading-4 text-[#667085] capitalize">
                    {item.colour} | {item.size}
                  </p>
                </div>
                <div className="">
                  <p className="font-semibold text-lg leading-[30px] text-right">₦{item.price}</p>
                  <p className="text-[#667085] text-right">Qty: {item.quantity}</p>
                </div>
                <Link to={`/orders/${order.id}`}className="basis-[50%] sm:basis-auto inline-block text-white bg-black px-4 sm:px-16 py-2 ml-5 sm:py-4 rounded-2xl">Track Order</Link>
                {/* <div>
                  <p className="text-[20px] leading-[30px] mb-1.5">Expected Delivery</p>
                  <span>{formatEstimatedDelivery(order.estimated_delivery)}</span>
                </div> */}
              </li>
              
            ))}
          </ul>
          <hr className="mt-10 border-t border-t-gray-300" />
          <hr className="mt-5 border-t border-t-gray-300" />
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={nextUrl}
        prevPageUrl={prevUrl}
        onPageChange={loadOrders}
        getPageUrl={getPageUrl}
      />
    </div>
  );
};

export default Order;
