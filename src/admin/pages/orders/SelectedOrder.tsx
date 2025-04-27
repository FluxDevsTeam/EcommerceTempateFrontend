import React from "react";
import { Order } from "./types"; // make sure this path is correct
import Dropdown from "./Dropdown";
import formatEstimatedDelivery from "./Date";

interface SelectedOrderPopupProps {
  selectedOrder: Order;
  onClose: () => void;
}

const SelectedOrderPopup: React.FC<SelectedOrderPopupProps> = ({ selectedOrder, onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm flex justify-center items-start z-50 pt-20">
      <div className="bg-white w-[80%] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className='flex justify-between items-center mb-3'>
          <h3 className="text-[18px] font-medium">Order {selectedOrder.id}</h3>
          <button onClick={onClose} className="mb-4 text-red-500 font-bold text-[25px]">X</button>
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
          <p className="flex items-center justify-end text-[#333333] font-semibold py-3 rounded-lg mt-4">
            <span className="w-[25%]">Subtotal</span>
            <span className="w-[25%]">₦{selectedOrder.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0).toLocaleString()}</span>
          </p>
          <p className="flex items-center justify-end text-[#333333] py-3 rounded-lg mt-4">
            <span className="w-[25%]">Delivery fee</span>
            <span className="w-[25%]">₦{parseFloat(selectedOrder.delivery_fee).toLocaleString()}</span>
          </p>
          <p className="flex items-center justify-end text-[#333333] font-bold py-3 rounded-lg mt-4">
            <span className="w-[25%]">Total</span>
            <span className="w-[25%]">
              ₦{(
                selectedOrder.order_items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
                + parseFloat(selectedOrder.delivery_fee)
              ).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectedOrderPopup;
