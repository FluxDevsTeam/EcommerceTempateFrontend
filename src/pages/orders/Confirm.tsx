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
        const foundOrder = data.find((order: OrderData) => order.id === id);
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

  return (
    <div className="p-4 sm:p-14 pb-10 sm:pb-28">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Track Orders</h2>
      <h4 className="text-[#344054] font-bold text-[18px] sm:text-[30px] mb-6">Order ID: {order.id}</h4>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
        <p className="flex gap-2 items-center">
          <span className="text-[#667085] text-sm leading-5">Order date:</span>
          <span className="text-[#1D2939]">{order.order_date}</span>
        </p>
        <p className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faCalendar} className="text-black w-5" />
          <span>Estimated delivery: {formatEstimatedDelivery(order.estimated_delivery)}</span>
        </p>
      </div>
      <div className="mb-4 flex flex-col">
        <span className="text-[20px] inline-block leading-[30px] mb-2">Status</span>
        <span className="bg-[#72D3E940] inline-block rounded-2xl pl-2 py-1 w-[150px]">{order.status}</span>
      </div>

      <ul className="w-full sm:w-[80%] flex flex-col gap-6 sm:gap-3">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex flex-wrap justify-between items-center">
            <div className="basis-[50%] sm:basis-[20%] bg-[#F0EEED] min-w-[123px] max-w-[124px] rounded-2xl overflow-hidden">
              <img src={item.image1 || shirt} className="w-full" alt={item.name} />
            </div>
            <div className="basis-[50%] sm:basis-[30%] mb-4">
              <p className="text-2xl leading-8 mb-3">{item.name}</p>
              <p className="leading-6 text-[#667085] capitalize">{item.colour} | {item.size}</p>
            </div>
            <div>
              <p className="font-semibold text-lg leading-[30px] text-right">₦{item.price}</p>
              <p className="text-[#667085] text-right">Qty: {item.quantity}</p>
            </div>
            <div>
              <p className="text-[20px] leading-[30px] mb-1.5">Expected Delivery</p>
              <p className="text-[#667085] font-medium text-[18px] leading-[28px]">
                {formatEstimatedDelivery(order.estimated_delivery)}
              </p>
            </div>
          </li>
        ))}
        <hr className="mt-5 border-t border-t-gray-300" />
      </ul>

      <div className="flex-col sm:flex items-start py-6 border-b border-b-gray-300 w-full sm:w-[80%]">
        <div className="basis-[50%] mb-8">
          <h6 className="font-medium text-[20px] leading-[30px] mb-2">Payment</h6>
          <p className="flex items-center gap-4">
            <span className="text-[14px] leading-[20px] text-[#667085]">Visa**56</span>
            <img src={visa} className="w-[24px]" alt="card" />
          </p>
        </div>
        <div className="font-medium">
          <h6 className="text-[20px] leading-[30px]">Delivery Address</h6>
            <p className="text-[18px] leading-[28px] text-[#667085]">{order.delivery_address}<br />{order.state}<br />{order.phone_number}</p>
        </div>
      </div>

      

      <div className="flex-col sm:flex pt-5 w-full sm:w-[80%]">
        <div className="font-medium basis-[50%] pr-4 sm:pr-24 mb-8">
          <h3 className='text-[20px] leading-[30px] mb-4'>Order Summary</h3>
          <div className="text-[#667085] text-[18px] leading-[28px]">
            <p className='flex justify-between items-center text-[#475467] text-[20px] leading-[30px] mb-2'>
              <span className=''>Discount</span>
              <span className='text-right'>0</span>
            </p>
            <p className='flex justify-between items-center mb-2'>
              <span className='text-[#00000099]'>Discount</span>
              <span className='text-right'>0</span>
            </p>
            <p className='flex justify-between items-center mb-2'>
              <span className='text-[#00000099]'>Delivery</span>
              <span className='text-right'>N {order.delivery_fee}</span>
            </p>
            <p className='flex justify-between items-center mb-2 mt-10'>
              <span>Total</span>
              <span className='text-[20px] leading-[30px] text-[#1D2939] font-bold'>$0.00</span>
            </p>
          </div>
        </div>
        <div className="font-medium">
          <h6 className="text-[20px] leading-[30px] mb-4">Need Help</h6>
          <p className='flex gap-2 items-center mb-2'>
            <img src={circle} className='w-[17px] h-[17px]' />
            <span className='text-[18px] text-[#667085] leading-[28px]'>Order Issues</span>
            <img src={arrow} className='w-[17px] h-[17px]' />
          </p>
          <p className='flex gap-2 items-center mb-2'>
            <img src={circle} className='w-[17px] h-[17px]' />
            <span className='text-[18px] text-[#667085] leading-[28px]'>Delivery Info</span>
            <img src={arrow} className='w-[17px] h-[17px]' />
          </p>
          <p className='flex gap-2 items-center'>
            <img src={circle} className='w-[17px] h-[17px]' />
            <span className='text-[18px] text-[#667085] leading-[28px]'>Terms of Service</span>
            <img src={arrow} className='w-[17px] h-[17px]' />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirm;