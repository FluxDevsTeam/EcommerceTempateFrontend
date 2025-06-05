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
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading  orders...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="w-full min-h-full grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-3xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold capitalize col-span-1 mb-2 md:mb-4 pt-5">My Orders</h2>

      {orders.length === 0 && !loading && (
        <div className="col-span-1 text-center py-10 text-gray-500">
          You have no orders yet.
        </div>
      )}

      {orders.map((order: OrderData) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-3 flex flex-col h-full">
          <div className="flex justify-between items-center mb-1.5">
            <h3 className="text-gray-700 font-semibold text-xs sm:text-sm truncate pr-2">Order ID: {order.id}</h3>
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full w-fit whitespace-nowrap ${order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 mb-2.5 space-y-0.5">
            <p className="flex items-center">
              <span className="font-medium text-gray-600 mr-1">Date:</span>
              <span>{order.order_date}</span>
            </p>
            <p className="flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400 w-2.5 h-2.5 mr-1" />
              <span className="font-medium text-gray-600 mr-1">Est. Delivery:</span> 
              <span>{formatEstimatedDelivery(order.estimated_delivery)}</span>
            </p>
          </div>

          <ul className="flex flex-col gap-1.5 mb-0 flex-grow min-h-[60px]">
            {order.order_items.map((item: OrderItem) => (
              <li key={item.id} className="flex items-start gap-2 pt-1.5 border-t border-gray-100 first:border-t-0 first:pt-0">
                <div className="bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image1} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[11px] sm:text-xs font-medium text-gray-700 mb-0 line-clamp-2">{item.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 capitalize">
                    {item.colour} | {item.size}
                  </p>
                </div>
                <div className="text-[10px] sm:text-xs text-right flex-shrink-0 ml-auto">
                  <p className="font-semibold text-gray-700">₦{item.price}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                <div className="mt-auto pt-2 border-t border-gray-100 flex justify-end">
            <Link to={`/orders/${order.id}`} className="text-[10px] sm:text-xs inline-block px-2 py-1 text-white bg-customBlue rounded hover:bg-customBlue-dark transition-colors whitespace-nowrap">
              Track Order
            </Link>
            </div>
                </div>
              </li>
            ))}
          </ul>
          </div>
      ))}
      { (nextUrl || prevUrl) &&
        <div className="col-span-1 mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              nextPageUrl={nextUrl}
              prevPageUrl={prevUrl}
              onPageChange={loadOrders}
              getPageUrl={getPageUrl}
            />
        </div>
      }
    </div>
  );
};

export default Order;
