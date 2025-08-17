import { useState, useEffect } from 'react';
import { FiMenu, FiGrid, FiShoppingBag } from "react-icons/fi";
import AdminHeaders from './AdminHeaders';
import AdminAggregates from './AdminAggregates';
import Dropdown from "./Dropdown";
import { fetchData } from './api';
import { Order } from "./types";
import formatEstimatedDelivery from "./Date";
import Pagination from './Pagination';
import SelectedOrderPopup from './SelectedOrder';
import { PatchOrderStatus } from './api';
import { formatCurrency } from "../../utils/formatting";

const ITEMS_PER_PAGE = 20;

const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
};

const AdminOrders = () => {
  const [layout, setLayout] = useState("menu");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All Categories");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  interface StatusColor {
    text: string;
    bg: string;
    dot: string;
  }

  const statusColors: { [key: string]: StatusColor } = {
    PAID: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-100" },
    SHIPPED: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-100" },
    DELIVERED: { dot: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-100" },
    CANCELLED: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-100" },
    DEFAULT: { dot: "bg-gray-500", text: "text-gray-700", bg: "bg-gray-100" },
  };

  const filteredOrders = statusFilter === "All Categories"
  ? orders
  : orders.filter((order) => order.status === statusFilter);

  const getPageUrl = (page: number) => `https://api.fluxdevs.com/api/v1/admin/order/?page=${page}&page_size=${ITEMS_PER_PAGE}`;

const loadOrders = async (url?: string, status = statusFilter) => {
  try {
      const fetchUrl = url || getPageUrl(currentPage || 1);
      const data = await fetchData(fetchUrl);
      
      let pageFromResponse = currentPage;
      if (data.current_page_number) {
        pageFromResponse = data.current_page_number;
      } else {
        const urlParams = new URLSearchParams(fetchUrl.split('?')[1]);
        pageFromResponse = parseInt(urlParams.get("page") || "1", 10);
      }

    const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("page", pageFromResponse.toString());
    window.history.pushState({}, "", newUrl.toString());

    const normalizedResults = data.results.map((order: Order) => ({
      ...order,
      status: order.status.toUpperCase(),
    }));

    setOrders(normalizedResults);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
      setCurrentPage(pageFromResponse);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
  } catch (err) {
      
  }
};

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page") || "1", 10);
    loadOrders(getPageUrl(page));
  }, []);

  return (
    <div className="leading-normal relative p-4 sm:p-6 bg-gray-50 min-h-screen">
      <AdminHeaders />
      <AdminAggregates />

      {/* Controls Bar */}
      <div className="mt-8 mb-6 bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-start sm:justify-end gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
          <Dropdown
              label="Filter by Status"
            options={["All Categories", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]}
            onSelect={(value) => setStatusFilter(value)}
          />
        </div>
          <div className="flex rounded-md border border-gray-300">
            <button
              title="List View"
              className={`p-2 transition-colors duration-150 ${layout === "menu" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setLayout("menu")}
        >
              <FiMenu size={18} />
            </button>
            <button
              title="Grid View"
              className={`p-2 border-l border-gray-300 transition-colors duration-150 ${layout === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setLayout("grid")}
        >
              <FiGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu View (Table) */}
      {layout === "menu" && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full min-w-full text-xs table-fixed">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider w-[30%] sm:w-[12%]">Date</th>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell sm:w-[22%]">Product(s)</th>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider w-[15%] hidden md:table-cell">State</th>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider w-[40%] sm:w-[20%]">Total Price</th>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider w-[21%] hidden lg:table-cell">Est. Delivery</th>
                <th className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-center font-medium text-gray-500 uppercase tracking-wider w-[30%] sm:w-[10%]">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const statusStyle = statusColors[order.status] || statusColors.DEFAULT;
                const productNames = order.order_items.map(item => item.name).join(', ');
            return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group" onClick={() => setSelectedOrder(order)}>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 whitespace-nowrap text-gray-600">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-gray-700 truncate hidden sm:table-cell" title={productNames}>{truncateString(productNames, 20)}</td>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 text-gray-600 hidden md:table-cell truncate" title={String(order.state ?? '')}>{order.state ?? ''}</td>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 whitespace-nowrap font-medium text-gray-700">
                      {formatCurrency(order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee))}
                    </td>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 whitespace-nowrap text-gray-600 hidden lg:table-cell">{formatEstimatedDelivery(order.estimated_delivery)}</td>
                    <td className="px-1.5 py-1 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] leading-tight font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${statusStyle.dot} inline-block self-center`}></span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {layout === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mt-6">
          {filteredOrders.map((order) => {
            const firstItem = order.order_items[0];
            const imageSrc = firstItem?.product?.image1;
            const statusStyle = statusColors[order.status] || statusColors.DEFAULT;

            return (
              <div key={order.id} 
                   className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col"
                   onClick={() => setSelectedOrder(order)}>
                <div className="relative h-40 w-full overflow-hidden">
                  {imageSrc ? (
                    <img src={imageSrc} alt={firstItem?.name || 'Product'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FiShoppingBag className="text-gray-400 w-12 h-12" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 inline-flex text-[10px] leading-tight font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                     <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${statusStyle.dot} inline-block self-center`}></span>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-0.5 truncate" title={order.order_items.map(item => item.name).join(", ")}>
                  {order.order_items.map(item => item.name).join(", ")}
                    </h3>
                    <p className="text-xs text-gray-500 mb-0.5">State: {order.state ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500 mb-1.5">ID: #{order.id.slice(0,8)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-md font-bold text-gray-800">
                      {formatCurrency(order.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0) + parseFloat(order.delivery_fee))}
                  </span>
                    {parseFloat(order.delivery_fee) > 0 && (
                       <span className="text-[10px] text-gray-400">
                         (+ {formatCurrency(parseFloat(order.delivery_fee))} del.)
                  </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
           {filteredOrders.length === 0 && (
             <p className="col-span-full text-center py-10 text-gray-500">No orders found.</p>
           )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={nextUrl}
        prevPageUrl={prevUrl}
        onPageChange={(url) => loadOrders(url, statusFilter)}
        getPageUrl={getPageUrl}
      />

      {selectedOrder && (
        <SelectedOrderPopup
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          isUpdatingStatus={isUpdatingStatus}
          onStatusChange={async (newStatus) => {
          if (selectedOrder) {
              setIsUpdatingStatus(true);
            const upperStatus = newStatus.toUpperCase();
            try {
              await PatchOrderStatus(selectedOrder.id, upperStatus);
              const updatedOrders = orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: upperStatus } : order
              );
              setOrders(updatedOrders);
              setSelectedOrder({ ...selectedOrder, status: upperStatus });
              } catch (error) {
                
                alert("Failed to change status. Please try again.")
              } finally {
                setIsUpdatingStatus(false);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;