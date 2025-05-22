import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

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
          `https://ecommercetemplate.pythonanywhere.com/api/v1/admin/order/?page=${page}&page_size=${ITEMS_PER_PAGE}`,
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
    return <div className="flex justify-center items-center h-32">
      <p>Loading orders...</p>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      <p>Error: {error}</p>
      {/* Optionally, add a retry button here */}
    </div>;
  }

  if (!loading && !orders.length && totalOrders === 0) {
    return <div className="p-4 text-center">
      <p>No orders found</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-bold">Order List</h2>
        {/* <div className="relative w-full sm:w-auto">
          <button className="flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-sm">
            {listPeriod}
            <ChevronDown size={16} />
          </button>
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Date",
                "Product",
                "Address",
                "Price",
                "Delivery",
                "Status",
       
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    {heading}
                    <span className="ml-1 text-xs">↕</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[80px] truncate">
                  {order.id}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 max-w-[120px] truncate">
                  {order.order_items.length > 0
                    ? order.order_items[0].name
                    : "N/A"}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 max-w-[150px] truncate">
                  <div className="flex flex-col">
                    <span>{order.city}</span>
                    <span className="text-xs text-gray-400 truncate">{order.delivery_address}</span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                ₦{order.total_amount}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {(() => {
                    try {
                      const dates: string[] = JSON.parse(
                        order.estimated_delivery.replace(/'/g, '"')
                      );
                      return dates[0] || "N/A";
                    } catch (err) {
                      return "N/A";
                    }
                  })()}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
   
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;