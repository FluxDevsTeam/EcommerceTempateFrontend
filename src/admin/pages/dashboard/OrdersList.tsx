import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StatusBadge from "./components/StatusBadge";

const OrdersList = () => {
  const [listPeriod, setListPeriod] = useState("Monthly");

  const orders = [
    {
      id: "#12594",
      date: "Dec 1, 2021",
      product: "Classic T-Shirt",
      address: "312  Ave",
      price: "$847.69",
      estimatedDelivery: "Dec 1, 2021",
      status: "On Delivery",
    },
    {
      id: "#12306",
      date: "Nov 02, 2021",
      product: "Wireless Earbuds",
      address: "5685 Portage",
      price: "$477.14",
      estimatedDelivery: "Nov 02, 2021",
      status: "Active",
    },
    {
      id: "#12490",
      date: "Nov 15, 2021",
      product: "Leather Wallet",
      address: "Lathrop Harvey",
      price: "$477.14",
      estimatedDelivery: "Nov 15, 2021",
      status: "On Delivery",
    },
    {
      id: "#12306",
      date: "Nov 02, 2021",
      product: "Wireless Earbuds",
      address: " Ave, Portage",
      price: "$477.14",
      estimatedDelivery: "Nov 02, 2021",
      status: "On Delivery",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order List</h2>
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-sm">
            {listPeriod}
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="sm:overflow-x-visible overflow-x-auto ">
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
      {orders.map((order, index) => (
        <tr
          key={index}
          className="border-t border-gray-300 hover:bg-gray-50 transition"
        >
          <td className="py-4 px-4 font-medium whitespace-nowrap">{order.id}</td>
          <td className="py-4 px-4 whitespace-nowrap">{order.date}</td>
          <td className="py-4 px-4 max-w-[150px] truncate">{order.product}</td>
          <td className="py-4 px-4 whitespace-nowrap">{order.address}</td>
          <td className="py-4 px-4 whitespace-nowrap">{order.price}</td>
          <td className="py-4 px-4 text-center whitespace-nowrap">
            {order.estimatedDelivery}
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
