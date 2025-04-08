import circle from './img/info-circle.png'
import arrow from './img/arrow-up.png'
import visa from './img/visa-logo.png'
import shirt from './img/shirt.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons";


const Confirm = () => {
  return (
    <div className="p-4 sm:p-14 pb-10 sm:pb-28">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Track Orders</h2>
      <h4 className="text-[#344054] font-bold text-[18px] sm:text-[30px] mb-6">Order ID: 3354654654526</h4>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
          <p className="flex gap-2 items-center">
            <span className="text-[#667085] text-sm leading-5">Order date:</span>
            <span className="text-[#1D2939]">Feb 16, 2022</span>
          </p>
          <p className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-black w-5" />
            <span>Estimated delivery: May 16, 2022</span>
          </p>
        </div>
      <ul className="w-full sm:w-[80%] flex flex-col gap-6 sm:gap-3">
        <li className="flex flex-wrap justify-between items-center">
          <div className="basis-[50%] sm:basis-[20%] bg-[#F0EEED] min-w-[123px] max-w-[124px] rounded-2xl overflow-hidden">
            <img src={shirt} className="w-full" />
          </div>
          <div className='basis-[50%] sm:basis-[30%] mb-4'>
            <p className="text-2xl leading-8 mb-3">MackBook Pro 14’’</p>
            <p className="leading-6 text-[#667085]">Space Gray  |  32GB  |  1 TB</p>
          </div>
          <div>
            <p className="font-semibold text-lg leading-[30px] text-right">$2599.00</p>
            <p className="text-[#667085] text-right">Oty: 1</p>
          </div>
          <div className='mb-4'>
            <p className="text-[20px] leading-[30px] text-center mb-2">Status</p>
            <p className="bg-[#72D3E940] rounded-2xl px-8 py-1">In warehouse</p>
          </div>
          <div>
            <p className="text-[20px] leading-[30px] mb-1.5">Expected Delivery</p>
            <p className="text-[#667085] font-medium text-[18px] leading-[28px]">12 April - 14 April 2025</p>
          </div>
        </li>

        <li className="flex justify-between items-center">
          <div className="basis-[50%] sm:basis-[20%] bg-[#F0EEED] max-w-[124px] rounded-2xl overflow-hidden mr-16">
            <img src={shirt} className="w-full" />
          </div>
          <div className='basis-[50%] sm:basis-[30%]'>
            <p className="text-2xl leading-8 mb-3">MackBook Pro 14’’</p>
            <p className="leading-6 text-[#667085]">Space Gray  |  32GB  |  1 TB</p>
          </div>

          <div className="ml-auto">
            <p className="font-semibold text-lg leading-[30px] text-right">$2599.00</p>
            <p className="text-[#667085] text-right">Oty: 1</p>
          </div>
        </li>
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
            <p className="text-[18px] leading-[28px] text-[#667085]">847 Jewess Bridge Apt. 174<br />London, UK<br />474-769-3919</p>
        </div>
      </div>

      

      <div className="flex-col sm:flex pt-5 w-full sm:w-[80%]">
        <div className="font-medium basis-[50%] pr-4 sm:pr-24 mb-8">
          <h3 className='text-[20px] leading-[30px] mb-4'>Order Summary</h3>
          <div className="text-[#667085] text-[18px] leading-[28px]">
            <p className='flex justify-between items-center text-[#475467] text-[20px] leading-[30px] mb-2'>
              <span className=''>Discount</span>
              <span className='text-right'>$565</span>
            </p>
            <p className='flex justify-between items-center mb-2'>
              <span className='text-[#00000099]'>Discount</span>
              <span className='text-right'>(20%) - $1109.40</span>
            </p>
            <p className='flex justify-between items-center mb-2'>
              <span className='text-[#00000099]'>Delivery</span>
              <span className='text-right'>$0.00</span>
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
  )
}

export default Confirm
