import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData } from "./api"; // assumes it fetches all orders
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import type { OrderData } from './types';
import circle from './img/info-circle.png';
import arrow from './img/arrow-up.png';
import visa from './img/visa-logo.png';
import shirt from './img/shirt.png';
import formatEstimatedDelivery from "./Date";
import { Link } from "react-router-dom";

const Confirm = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchData(); // returns array of orders
        const foundOrder = data.results.find((order: OrderData) => order.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!order) return null;
  
  const steps = ["Paid", "Shipped", "Delivered"];
  const normalizedStatus = order.status.toLowerCase();
  const currentStepIndex = steps.findIndex(step => step.toLowerCase() === normalizedStatus);
  const isValidStatus = currentStepIndex !== -1;
  

  return (
    <div className="p-4 pt-6 md:p-8 lg:p-12 max-w-4xl mx-auto mt-5 md:mt-10">
      <h2 className="font-semibold text-2xl md:text-3xl tracking tight mb-6 md:mb-8">Track Order</h2>
      <div className="border border-gray-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h4 className="text-gray-700 font-semibold text-base sm:text-lg mb-2 sm:mb-0">Order ID: {order.id}</h4>
          <span className={`text-sm px-3 py-1 rounded-full w-fit ${order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-4 text-sm text-gray-600">
          <p className="flex gap-1.5 items-center">
            <span className="font-medium">Order date:</span>
            <span>{order.order_date}</span>
          </p>
          <p className="flex gap-1.5 items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-gray-500 w-4 h-4" />
            <span>Estimated delivery: {formatEstimatedDelivery(order.estimated_delivery)}</span>
          </p>
        </div>
        {isValidStatus && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-grow">
                  <div className="flex items-center w-full">
                     {index > 0 && (
                      <div
                        className={`flex-1 h-0.5 ${ 
                          index <= currentStepIndex ? 'bg-black' : 'bg-gray-300'
                        }`}
                      />
                    )}
                    <div
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${ 
                        index <= currentStepIndex ? 'bg-black' : 'bg-gray-300'
                      }`}
                    />
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 ${ 
                          index < currentStepIndex ? 'bg-black' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                  <span className={`mt-1.5 text-xs sm:text-sm ${index <= currentStepIndex ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* <div className="mb-4 flex flex-col">
        <span className="text-[20px] inline-block leading-[30px] mb-2">Status</span>
        <span className="bg-[#72D3E940] inline-block rounded-2xl pl-2 py-1 w-[150px]">{order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}</span>
      </div> */}

      <div className="border border-gray-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <h5 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h5>
        <ul className="w-full flex flex-col gap-3">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 p-2.5 border-b border-gray-100 last:border-b-0">
              <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.image1 || shirt} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 line-clamp-2">{item.name}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 capitalize">{item.colour} | {item.size}</p>
              </div>
              <div className="text-xs sm:text-sm text-right flex-shrink-0 ml-2">
                <p className="font-semibold text-gray-700">₦{item.price}</p>
                <p className="text-gray-500 text-[11px] sm:text-xs">Qty: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="border border-gray-200 rounded-lg p-4 md:p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-3">Delivery Address</h6>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.delivery_address}</p>
            <p>{order.state}</p>
            <p>{order.phone_number}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 md:p-6">
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>Order Summary</h3>
          <div className="text-sm text-gray-600 space-y-1.5">
            <p className='flex justify-between items-center text-gray-700'>
              <span className=''>Amount</span>
              <span className='text-right'>₦{order.total_amount}</span>
            </p>
            {/* <p className='flex justify-between items-center'>
              <span className='text-gray-500'>Discount</span>
              <span className='text-right'>₦0.00</span> </p> */}
            <p className='flex justify-between items-center'>
              <span className='text-gray-500'>Delivery</span>
              <span className='text-right'>₦{order.delivery_fee}</span>
            </p>
            <p className='flex justify-between items-center pt-2 mt-2 border-t border-gray-200'>
              <span className="font-semibold text-gray-800">Total</span>
              <span className='text-base font-bold text-gray-900'>
                ₦{(parseFloat(order.total_amount) + parseFloat(order.delivery_fee)).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 border border-gray-200 rounded-lg p-4 md:p-6">
        <h6 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h6>
        <div className="space-y-2">
          <Link to="/contact" className='flex gap-2 items-center text-sm text-blue-600 hover:underline'>
            <img src={circle} className='w-4 h-4' alt="" />
            <span>Order Issues</span>
            <img src={arrow} className='w-4 h-4 transform -rotate-90' alt="" />
          </Link>
          <Link to="/contact" className='flex gap-2 items-center text-sm text-blue-600 hover:underline'>
            <img src={circle} className='w-4 h-4' alt="" />
            <span>Delivery Info</span>
            <img src={arrow} className='w-4 h-4 transform -rotate-90' alt="" />
          </Link>
          <Link to="/terms-of-service" className='flex gap-2 items-center text-sm text-blue-600 hover:underline'>
            <img src={circle} className='w-4 h-4' alt="" />
            <span>Terms of Service</span>
            <img src={arrow} className='w-4 h-4 transform -rotate-90' alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirm;