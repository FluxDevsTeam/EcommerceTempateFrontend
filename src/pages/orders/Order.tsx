import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import shirt from './img/shirt.png'
import { Link } from "react-router-dom";

const Order = () => {
  const items = [1, 2]
  return (
    <div className='p-14 pb-28'>
      <h2 className="font-normal text-[40px] leading-[100%] tracking-[0%] align-middle mb-8">My Orders</h2>
      <div className="">
        <h4 className="text-[#344054] font-bold text-[30px] mb-6">Order ID: 3354654654526</h4>
        <div className="flex gap-6 items-center mb-6">
          <p className="flex gap-2 items-center">
            <span className="text-[#667085] text-sm leading-5">Order date:</span>
            <span className="text-[#1D2939]">Feb 16, 2022</span>
          </p>
          <p className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-black w-5" />
            <span>Estimated delivery: May 16, 2022</span>
          </p>
        </div>
        <ul className="flex flex-col gap-6">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div className="bg-[#F0EEED] w-[124px] rounded-2xl overflow-hidden">
                <img src={shirt} className="w-full" />
              </div>
              <div>
                <p className="text-2xl leading-8 mb-3">MackBook Pro 14’’</p>
                <p className="leading-6 text-[#667085]">Space Gray  |  32GB  |  1 TB</p>
              </div>
              <div>
                <p className="font-semibold text-lg leading-[30px] text-right">$2599.00</p>
                <p className="text-[#667085] text-right">Oty: 1</p>
              </div>
              <div>
                <p className="text-[20px] leading-[30px] text-center mb-2">Status</p>
                <p className="bg-[#72D3E940] rounded-2xl px-8 py-1">In warehouse</p>
              </div>
              <div>
                <p className="text-[20px] leading-[30px] mb-1.5">Expected Delivery</p>
                <p className="text-[#667085] font-medium text-[18px] leading-[28px]">12 April - 14 April 2025</p>
              </div>
              <Link to='/orders/confirm' className="text-white bg-black px-8 py-4 rounded-2xl">Track Order</Link>
            </li>
          ))}
        </ul>
        <hr className="mt-10 border-t border-t-gray-300" />
        <hr className="mt-5 border-t border-t-gray-300" />
      </div>

      <div className="pt-15">
        <h4 className="text-[#344054] font-bold text-[30px] mb-6">Order ID: 3354654654526</h4>
        <div className="flex gap-6 items-center mb-6">
          <p className="flex gap-2 items-center">
            <span className="text-[#667085] text-sm leading-5">Order date:</span>
            <span className="text-[#1D2939]">Feb 16, 2022</span>
          </p>
          <p className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-black w-5" />
            <span>Estimated delivery: May 16, 2022</span>
          </p>
        </div>
        <ul className="flex flex-col gap-6">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div className="bg-[#F0EEED] w-[124px] rounded-2xl overflow-hidden">
                <img src={shirt} className="w-full" />
              </div>
              <div>
                <p className="text-2xl leading-8 mb-3">MackBook Pro 14’’</p>
                <p className="leading-6 text-[#667085]">Space Gray  |  32GB  |  1 TB</p>
              </div>
              <div>
                <p className="font-semibold text-lg leading-[30px] text-right">$2599.00</p>
                <p className="text-[#667085] text-right">Oty: 1</p>
              </div>
              <div>
                <p className="text-[20px] leading-[30px] text-center mb-2">Status</p>
                <p className="bg-[#72D3E940] rounded-2xl px-8 py-1">In warehouse</p>
              </div>
              <div>
                <p className="text-[20px] leading-[30px] mb-1.5">Expected Delivery</p>
                <p className="text-[#667085] font-medium text-[18px] leading-[28px]">12 April - 14 April 2025</p>
              </div>
              <Link to='/orders/confirm' className="text-white bg-black px-8 py-4 rounded-2xl">Track Order</Link>
            </li>
          ))}
        </ul>
        <hr className="mt-10 border-t border-t-gray-300" />
        <hr className="mt-5 border-t border-t-gray-300" />
      </div>
    </div>
  )
}

export default Order