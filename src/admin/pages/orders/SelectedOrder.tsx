import React, { useEffect, useState } from "react";
import { Order } from "./types";
import Dropdown from "./Dropdown"; // Ensure this Dropdown is well-styled or allow styling props
import formatEstimatedDelivery from "./Date";
import { formatCurrency, formatNumberWithCommas } from "../../utils/formatting";
import { FiX, FiAlertTriangle, FiHelpCircle } from "react-icons/fi"; // Added FiHelpCircle for generic confirm

interface SelectedOrderPopupProps {
  selectedOrder: Order;
  onClose: () => void;
  onStatusChange: (newStatus: string) => Promise<void>; // Make sure onStatusChange can be async and handle loading state
  isUpdatingStatus?: boolean; // Added for loading state indication
}

const SelectedOrderPopup: React.FC<SelectedOrderPopupProps> = ({ selectedOrder, onClose, onStatusChange, isUpdatingStatus }) => {
  const [statusToConfirm, setStatusToConfirm] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-1">
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="ml-2 text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );

  const handleStatusSelection = (newStatus: string) => {
    setStatusToConfirm(newStatus);
  };

  const confirmStatusChange = async () => {
    if (statusToConfirm) {
      await onStatusChange(statusToConfirm);
      setStatusToConfirm(null);
    }
  };

  const cancelStatusChange = () => {
    setStatusToConfirm(null);
  };

  const currentStatusFormatted = selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).toLowerCase();

  return (
    // Main modal overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className='flex justify-between items-center p-4 sm:p-5 border-b border-gray-200'>
          <h3 className="text-lg font-semibold text-gray-800">Order Details: #{selectedOrder.id.slice(0,8)}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
            disabled={isUpdatingStatus} // Disable close if updating
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-5 space-y-6 overflow-y-auto">
          <p className="text-sm text-gray-600">
            Placed on <span className="font-medium">{new Date(selectedOrder.order_date).toLocaleDateString()}</span> by <span className="font-medium">{selectedOrder.first_name} {selectedOrder.last_name}</span>
          </p>

          {/* Customer Details Section */}
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Customer Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <DetailItem label="First Name" value={selectedOrder.first_name} />
              <DetailItem label="Last Name" value={selectedOrder.last_name} />
              <DetailItem label="Email" value={selectedOrder.email} />
              <DetailItem label="Phone" value={selectedOrder.phone_number} />
              <DetailItem label="Address" value={selectedOrder.delivery_address} />
              <DetailItem label="City/Region" value={selectedOrder.state} />
              <DetailItem label="Est. Delivery" value={formatEstimatedDelivery(selectedOrder.estimated_delivery)} />
            </div>
          </div>

          {/* Status and Delivery Fee Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-200 rounded-md p-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Order Status</p>
              <div className="relative">
                <Dropdown
                  label={currentStatusFormatted}
                  options={["PAID", "SHIPPED", "DELIVERED", "CANCELLED"]}
                  onSelect={handleStatusSelection}
                  disabled={isUpdatingStatus} // Disable dropdown if updating
                />
                {isUpdatingStatus && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right sm:text-left flex-1">
              <p className="text-sm text-gray-500">Total Delivery Fee</p>
              <p className="text-lg font-semibold text-gray-800">{formatCurrency(selectedOrder.delivery_fee)}</p>
            </div>
          </div>

          {/* Products/Items Section */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Order Items</h4>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {selectedOrder.order_items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap truncate max-w-xs">{item.name}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{formatNumberWithCommas(item.quantity)}</td>
                      <td className="px-3 py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="px-3 py-3 text-right font-medium text-gray-800">{formatCurrency(item.quantity * parseFloat(item.price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Totals Section */}
          <div className="space-y-1 pt-3 border-t border-gray-200 text-sm">
             <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0))}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.delivery_fee)}</span>
            </div>
            <div className="flex justify-between items-center text-md pt-1 border-t border-gray-100 mt-1">
                <span className="font-semibold text-gray-800">Grand Total:</span>
                <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(
                        selectedOrder.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
                        + parseFloat(selectedOrder.delivery_fee)
                    )}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generic Confirmation Modal */}
      {statusToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-7 text-center w-full max-w-md">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${statusToConfirm === "CANCELLED" ? "bg-red-100" : "bg-blue-100"} mb-4`}>
                {statusToConfirm === "CANCELLED" ? <FiAlertTriangle className="h-6 w-6 text-red-600" /> : <FiHelpCircle className="h-6 w-6 text-blue-600"/>}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Status Change</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to change the order status to <strong>{statusToConfirm.charAt(0).toUpperCase() + statusToConfirm.slice(1).toLowerCase()}</strong>?
              {statusToConfirm === "CANCELLED" && " This action may not be easily reversible."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={confirmStatusChange}
                className={`w-full sm:w-auto justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${statusToConfirm === "CANCELLED" ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}`}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Confirm"}
              </button>
              <button
                onClick={cancelStatusChange}
                className="w-full sm:w-auto justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedOrderPopup;
