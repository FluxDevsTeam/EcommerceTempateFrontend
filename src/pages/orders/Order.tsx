import slippers from './img/slippers.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

const Order = () => {
  return (
    <div className='p-14'>
      <h2 className="font-normal text-[40px] leading-[100%] tracking-[0%] align-middle">Your Cart</h2>
      <div className='flex'>
        <div className='flex border border-[#0000001A]'>
          <div>
            <img src={slippers} alt="img" className='w-[124px]' />
          </div>
          <div>
            <h4 className='flex gap-20 items-center'>
              <span className='text-[20px] font-bold'>Gradient Graphic T-Shirt</span>
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 w-6 h-6" />
            </h4>
            <p className='text-[14px] flex gap-1.5'>
              <span className='font-bold'>Size:</span>
              <span className='font-extralight'>Large</span></p>
            <p className='text-[14px] flex gap-1.5'>
              <span className='font-bold'>Color:</span>
              <span className='font-extralight'>White</span></p>
            <p>$145</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Order