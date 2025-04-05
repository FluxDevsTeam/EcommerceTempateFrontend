import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import slippers from './img/slippers.png'
import shirt from './img/shirt.png'
import Wish from "./Wish"

const Order = () => {
  return (
    <div className='p-14'>
      <h2 className="font-normal text-[40px] leading-[100%] tracking-[0%] align-middle mb-8">Your Cart</h2>
      <div className='flex gap-8 items-start mb-24'>
        <div className='border border-[#0000001A] rounded-3xl p-5 basis-[60%]'>
          <div className='flex gap-4 border-b py-5 border-b-gray-300'>
            <div className='bg-[#F0F0F0] flex justify-center items-center'>
              <img src={slippers} alt="img" className='w-[100px]' />
            </div>
            <div className='basis-[100%]'>
              <h4 className='flex justify-between items-center'>
                <span className='text-[20px] font-bold'>Gradient Graphic T-Shirt</span>
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 w-6 h-6" />
              </h4>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Size:</span>
                <span className='font-extralight'>Large</span></p>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Color:</span>
                <span className='font-extralight'>White</span></p>
              <div className='flex justify-between items-center'>
                <p>$145</p>
                <div><span className='bg-[#F0F0F0] px-2'>-</span><span className='px-2'>1</span><span className='bg-[#F0F0F0] px-2'>+</span></div>
              </div>
            </div>
          </div>

          <div className='flex gap-4 py-5 border-b border-b-gray-300'>
            <div className='bg-[#F0F0F0] flex justify-center items-center'>
              <img src={slippers} alt="img" className='w-[100px]' />
            </div>
            <div className='basis-[100%]'>
              <h4 className='flex justify-between items-center'>
                <span className='text-[20px] font-bold'>Gradient Graphic T-Shirt</span>
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 w-6 h-6" />
              </h4>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Size:</span>
                <span className='font-extralight'>Large</span></p>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Color:</span>
                <span className='font-extralight'>White</span></p>
              <div className='flex justify-between items-center'>
                <p>$145</p>
                <div><span className='bg-[#F0F0F0] px-2'>-</span><span className='px-2'>1</span><span className='bg-[#F0F0F0] px-2'>+</span></div>
              </div>
            </div>
          </div>

          <div className='flex gap-4 py-5'>
            <div className='bg-[#F0F0F0] flex justify-center items-center'>
              <img src={slippers} alt="img" className='w-[100px]' />
            </div>
            <div className='basis-[100%]'>
              <h4 className='flex justify-between items-center'>
                <span className='text-[20px] font-bold'>Gradient Graphic T-Shirt</span>
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 w-6 h-6" />
              </h4>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Size:</span>
                <span className='font-extralight'>Large</span></p>
              <p className='text-[14px] flex gap-1.5'>
                <span className='font-bold'>Color:</span>
                <span className='font-extralight'>White</span></p>
              <div className='flex justify-between items-center'>
                <p>$145</p>
                <div><span className='bg-[#F0F0F0] px-2'>-</span><span className='px-2'>1</span><span className='bg-[#F0F0F0] px-2'>+</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className='border border-[#0000001A] rounded-3xl p-5 basis-[40%]'>
          <h3 className='text-[24px] mb-8'>Order Summary</h3>
          <div>
            <p className='flex justify-between items-center text-[20px] mb-4'>
              <span className='text-[#00000099]'>Subtotal</span>
              <span className='text-[#000000]'>$565</span>
            </p>
            <p className='flex justify-between items-center text-[20px] border-b border-b-gray-300 pb-4'>
              <span className='text-[#00000099]'>Discount (-20%)</span>
              <span className='text-[#FF3333]'>-$565</span>
            </p>
            <p className='flex justify-between items-center text-[20px] py-4 mb-4'>
              <span>Total</span>
              <span className='text-[24px]'>$565</span>
            </p>
          </div>
          <button className='text-white bg-black w-full p-3 rounded-full'>Proceed to checkout &rarr; </button>
        </div>
      </div>
      <h3 className='text-[48px] mb-12 text-center'>You might also like</h3>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <div className="relative w-fit mb-4">
            <img src={shirt} className="rounded-3xl" />
            <Wish />
          </div>
          <p className="text-[20px] mb-2">Polo with Contrast Trims</p>
          <div className="flex gap-4">
            <span className="text-[24px]">$212</span>
            <span className="text-[24px] text-[#00000066] line-through">$242</span>
            <span className="text-[#FF3333] bg-red-200 text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">-20%</span>
          </div>
        </div>

        <div>
          <div className="relative w-fit">
            <img src={shirt} className="rounded-3xl" />
            <Wish />
          </div>
          <p className="text-[20px]">Polo with Contrast Trims</p>
          <div className="flex gap-4">
            <span className="text-[24px]">$212</span>
            <span className="text-[24px] text-[#00000066] line-through">$242</span>
            <span className="text-[#FF3333] bg-red-200 text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">-20%</span>
          </div>
        </div>

        <div>
          <div className="relative w-fit">
            <img src={shirt} className="rounded-3xl" />
            <Wish />
          </div>
          <p className="text-[20px]">Polo with Contrast Trims</p>
          <div className="flex gap-4">
            <span className="text-[24px]">$212</span>
            <span className="text-[24px] text-[#00000066] line-through">$242</span>
            <span className="text-[#FF3333] bg-red-200 text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">-20%</span>
          </div>
        </div>

        <div>
          <div className="relative w-fit">
            <img src={shirt} className="rounded-3xl" />
            <Wish />
          </div>
          <p className="text-[20px]">Polo with Contrast Trims</p>
          <div className="flex gap-4">
            <span className="text-[24px]">$212</span>
            <span className="text-[24px] text-[#00000066] line-through">$242</span>
            <span className="text-[#FF3333] bg-red-200 text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">-20%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order