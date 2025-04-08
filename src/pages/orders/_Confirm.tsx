import { Link } from "react-router-dom"
import visa from './img/visa.png'
import paypal from './img/paypal.png'
import master from './img/master.png'

const Confirm = () => {
  return (
    <div className='p-14'>
      <h2 className="font-normal text-[40px] leading-[100%] tracking-[0%] align-middle mb-8">Confrim your Order</h2>
      <div className="flex gap-8 items-start mb-24">
        <form className="basis-[60%]">
            <div className='flex justify-between items-center gap-8 mb-10'>
                <div className="flex flex-col basis-[50%]">
                    <label className="text-[24px] mb-2.5">First Name</label>
                    <input type='text' placeholder='John' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
                </div>
                <div className="flex flex-col basis-[50%]">
                    <label className="text-[24px] mb-2.5">Last Name</label>
                    <input type='text' placeholder='Doe' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
                </div>
            </div>
            <div className="flex flex-col mb-10">
                <label className="text-[24px] mb-2.5">Email Address</label>
                <input type='email' placeholder='abc@exmple.com' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
            </div>
            <div className='flex justify-between items-center gap-8 mb-10'>
                <div className="flex flex-col basis-[50%]">
                    <label className="text-[24px] mb-2.5">State</label>
                    <input type='text' placeholder='Enter State' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
                </div>
                <div className="flex flex-col basis-[50%]">
                    <label className="text-[24px] mb-2.5">City</label>
                    <input type='text' placeholder='City' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
                </div>
            </div>
            <div className="flex flex-col mb-10">
                <label className="text-[24px] mb-2.5">Delivery Address</label>
                <input type='email' placeholder="223B Baker's street" className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
            </div>
            <div className="flex flex-col mb-10">
                <label className="text-[24px] mb-2.5">Phone Number</label>
                <input type='number' placeholder='+234' className="border border-[#CACACA80] rounded-[10px] py-2 px-5 text-[20px]" />
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
            <p className='flex justify-between items-center text-[20px] mb-4'>
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
        <h4 className="text-[24px] text-[#023047] mb-6 px-4">Payment Method</h4>
        <div className="rounded-3xl bg-[#E6E6E657] p-8 flex justify-between items-center">
            <p className="flex flex-col text-[#020247] gap-3">
                <span className="text-[24px]">Credit Card, Transfer, Ussd</span>
                <span className="text-[20px]">Secure and encrypyed</span>
            </p>
            <p className="flex items-center">
                <img src={visa} alt="visa" className="w-[109px] h-[50px] mr-4" />
                <img src={paypal} alt="paypal" className="w-[132px] h-[34px] mr-2.5" />
                <img src={master} alt="master" className="w-[53px] h-[31px]" />
            </p>
        </div>
      </div>
    </div>
  )
}

export default Confirm
