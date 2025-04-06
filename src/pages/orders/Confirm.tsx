import { Link } from "react-router-dom"
import visa from './img/visa.png'
import paypal from './img/paypal.png'
import master from './img/master.png'

const Confirm = () => {
  return (
    <div className='p-14'>
      <h2 className="font-normal text-[40px] leading-[100%] tracking-[0%] align-middle mb-8">Confrim your Order</h2>
      <div className="flex">
        <form className="basis-[60%]">
            <div className='flex'>
                <div>
                    <label>First Name</label>
                    <input type='text' placeholder='John' />
                </div>
                <div>
                    <label>Last Name</label>
                    <input type='text' placeholder='Doe' />
                </div>
            </div>
            <div>
                <label>Email Address</label>
                <input type='email' placeholder='abc@exmple.com' />
            </div>
            <div className='flex'>
                <div>
                    <label>State</label>
                    <input type='text' placeholder='Enter State' />
                </div>
                <div>
                    <label>City</label>
                    <input type='text' placeholder='City' />
                </div>
            </div>
            <div>
                <label>Delivery Address</label>
                <input type='email' placeholder="223B Baker's street" />
            </div>
            <div>
                <label>Phone Number</label>
                <input type='number' placeholder='+234' />
            </div>
            <Link to='/orders/confirm' className='text-white bg-black w-full p-3 rounded-full block text-center'>Confirm Delivery</Link>
        </form>
        <div className='border border-[#0000001A] rounded-3xl p-5 basis-[40%]'>
          <h3 className='text-[24px] mb-8'>Order Summary</h3>
          <div>
            <p className='flex justify-between items-center text-[20px] mb-4'>
              <span className='text-[#00000099]'>Subtotal</span>
              <span className='text-[#000000]'>$565</span>
            </p>
            <p className='flex justify-between items-center text-[20px] mb-4'>
              <span className='text-[#00000099]'>No. of items</span>
              <span className='text-[#000000]'>3</span>
            </p>
            <p className='flex justify-between items-center text-[20px] mb-4'>
              <span className='text-[#00000099]'>Delivery fee</span>
              <span className='text-[#000000]'>$15</span>
            </p>
            <p className='flex justify-between items-center text-[20px] py-4 mb-4'>
              <span>Total</span>
              <span className='text-[24px]'>$465</span>
            </p>
            <p className='flex justify-between items-center text-[20px] mb-4'>
              <span className='text-[#00000099]'>Estimated Delivery</span>
              <span className='text-[#000000]'>4th - 8th of April</span>
            </p>
          </div>
          <Link to='/orders/confirm' className='text-white bg-black w-full p-3 rounded-full block text-center'>Proceed to payment &rarr; </Link>
        </div>
      </div>
      <div className="w-[50vw]">
        <h4>Payment Method</h4>
        <div className="border border-gray-700 rounded-3xl">
            <p className="flex flex-col">
                <span>Credit Card, Transfer, Ussd</span>
                <span>Secure and encrypyed</span>
            </p>
            <p className="flex">
                <img src={visa} alt="visa" />
                <img src={paypal} alt="paypal" />
                <img src={master} alt="master" />
            </p>
        </div>
      </div>
    </div>
  )
}

export default Confirm
