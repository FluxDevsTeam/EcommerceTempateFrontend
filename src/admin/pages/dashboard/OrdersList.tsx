import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronsUpDown } from "lucide-react";
import { formatCurrency, formatNumberWithCommas } from "../../utils/formatting";
import StatusBadge from "./components/StatusBadge";

interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  name: string;
  size: string;
  description: string;
  colour: string;
  image1: string;
  price: string;
}

interface Order {
  id: string;
  payment_provider: string;
  transaction_id: string;
  user: number;
  order_date: string;
  created_at: string;
  status: string;
  delivery_fee: string;
  total_amount: string;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
  city: string;
  delivery_address: string;
  phone_number: string;
  delivery_date: string | null;
  estimated_delivery: string;
  order_items: OrderItem[];
}

const ITEMS_PER_PAGE = 10;

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listPeriod, setListPeriod] = useState("All Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async (page: number) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/order/?page=${page}&page_size=${ITEMS_PER_PAGE}`,
          {
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data && response.data.results) {
          setOrders(response.data.results);
          setTotalOrders(response.data.count || 0);
          setTotalPages(Math.ceil((response.data.count || 0) / ITEMS_PER_PAGE));
        } else {
          setOrders([]);
          setTotalOrders(0);
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders.');
        
        if (err.response?.status === 401) {
          console.log('Unauthorized - redirecting to login');
          // Potentially redirect to login page here
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(currentPage);
  }, [currentPage]); // Refetch when currentPage changes

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading && !orders.length) { // Show loading only on initial load or when orders are empty
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center h-40">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6 text-red-600">
        <p className="font-semibold">Error loading orders:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!loading && !orders.length && totalOrders === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Recent Orders</h2>
        {/* Filter/Search could go here */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Order ID",
                "Date",
                "Product",
                "Address",
                "Price",
                "Delivery Est.", // Updated heading
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    {heading}
                    {heading !== "Status" && <ChevronsUpDown size={11} className="ml-1 text-gray-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/75 transition-colors duration-150 ease-in-out align-top"
              >
                <td className="px-2.5 py-3 whitespace-nowrap text-xs font-medium text-gray-700 max-w-[90px] truncate">
                  #{order.id.substring(0, 7)}...
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-2.5 py-3 text-xs text-gray-500 max-w-[150px] truncate">
                  {order.order_items.length > 0
                    ? order.order_items[0].name
                    : "N/A"}
                </td>
                <td className="px-2.5 py-3 text-xs text-gray-500 max-w-[140px] truncate">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{order.city}</span>
                    <span className="text-[11px] text-gray-400 truncate">{order.delivery_address}</span>
                  </div>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap text-xs text-gray-600 font-semibold">
                {formatCurrency(order.total_amount)}
                </td>
                <td className="px-2.5 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {(() => {
                    try {
                      const dates: string[] = JSON.parse(
                        order.estimated_delivery.replace(/'/g, '"')
                      );
                      return dates[0] ? new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "-";
                    } catch (err) {
                      return "-"; // More compact than N/A
                    }
                  })()}
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-row justify-between items-center mt-4 pt-3 border-t border-gray-200 gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
          >
            Previous
          </button>
          <span className="text-[11px] text-gray-600 flex-grow text-center sm:text-left">
            Page {formatNumberWithCommas(currentPage)} of {formatNumberWithCommas(totalPages)} <span className="hidden sm:inline"> (Total: {formatNumberWithCommas(totalOrders)})</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;