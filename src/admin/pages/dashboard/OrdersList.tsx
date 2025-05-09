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

// Simple status badge component
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
      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listPeriod, setListPeriod] = useState("All Orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          "https://ecommercetemplate.pythonanywhere.com/api/v1/admin/dashboard/",
          {
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data && response.data.results) {
          setOrders(response.data.results);
          console.log(response)
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders.');
        
        // Optional: Handle 401 unauthorized errors
        if (err.response?.status === 401) {
          // You might want to redirect to login or refresh the token here
          console.log('Unauthorized - redirecting to login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-32">
      <p>Loading orders...</p>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      <p>Error: {error}</p>
    </div>;
  }

  if (!orders.length) {
    return <div className="p-4">
      <p>No orders found</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order List</h2>
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-sm">
            {listPeriod}
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sm:overflow-x-visible overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              {[
                "ID",
                "Date",
                "Product Name",
                "Address",
                "Price",
                "Estimated Delivery Date",
                "Status Order",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="pb-4 px-4 font-medium whitespace-nowrap"
                >
                  {heading} <span className="text-xs">↕</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-4 font-medium whitespace-nowrap">
                  {order.id}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 max-w-[150px] truncate">
                  {order.order_items.length > 0
                    ? order.order_items[0].name
                    : "N/A"}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {order.delivery_address}, {order.city}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  ${order.total_amount}
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  {(() => {
                    try {
                      const dates: string[] = JSON.parse(
                        order.estimated_delivery.replace(/'/g, '"')
                      );
                      return dates[0] || "N/A";
                    } catch (err) {
                      return "Invalid date";
                    }
                  })()}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;