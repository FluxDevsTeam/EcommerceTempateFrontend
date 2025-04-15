import { Link } from "react-router-dom"
import call from './img/call-calling.png'
import location from './img/location.png'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className="p-4 sm:p-14">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Contact Us</h2>
        <div className="flex-col sm:flex gap-8 items-start mb-12">
            <form className="p-0 border-0 sm:p-8 sm:border sm:border-[#0000000D] rounded-2xl mb-18 sm:mb-2">
                <div className='flex flex-wrap justify-between items-center gap-4 mb-10'>
                    <div className="flex flex-col w-full">
                        <label className="text-[#00000094] mb-2.5">First Name <span className="text-orange-700">*</span></label>
                        <input type='text' className="border border-[#CACACA80] rounded-[10px] py-2 px-5" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#00000094] mb-2.5">Last Name <span className="text-orange-700">*</span></label>
                        <input type='text' className="border border-[#CACACA80] rounded-[10px] py-2 px-5" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#00000094] mb-2.5">Your Phone <span className="text-orange-700">*</span></label>
                        <input type='number' className="border border-[#CACACA80] rounded-[10px] py-2 px-5" />
                    </div>
                </div>
                
                <div className="flex flex-col mb-10">
                    <label htmlFor="message" className="text-[#00000094] mb-2.5">Message</label>
                    <textarea className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700 text-sm resize-none h-[120px] sm:h-[200px]"></textarea>
                </div>
                
                <Link to='/orders/confirm' className='text-white bg-black w-full p-3 rounded-full block text-center'>Send Message</Link>
            </form>

            <div>
                <p className="font-hanken-grotesk font-medium mb-10">We’re here to help!<br />Our Customer Service Team is available<br />8am - 5pm, seven days a week.</p>
                <div className="mb-8">
                    <p className="flex gap-3 items-center">
                        <img src={call} alt="call" className="w-[24px] h-[24px]" />
                        <span className="font-semibold text-[24px] text-right">Call: +234 700 123 4567</span>
                    </p>
                    <p className="text-[#333333] mb-0.5">Talk to a Customer Service<br />Representative for help with our site,<br />app, or finding a Redfin Agent.</p>
                    <p className="text-[#063AF5]">Email: info@mycaban.com</p>
                </div>
                <div className="mb-8">
                    <p className="flex gap-3 items-center">
                        <img src={location} alt="location" className="w-[24px] h-[24px]" />
                        <span className="font-semibold text-[24px]">Address</span>
                    </p>
                    <p className="text-[#333333] mb-0.5">Talk to a Customer Service<br />Representative for help with our site,<br />app, or finding a Redfin Agent.</p>
                </div>
                <div>
                    <p className="font-semibold text-[24px] text-[#292929] mb-2">Connect with us</p>
                    <div className="flex gap-6">
                        <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={30} />
                        </Link>
                        <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter size={30} />
                        </Link>
                        <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={30} />
                        </Link>
                        <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={30} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact
