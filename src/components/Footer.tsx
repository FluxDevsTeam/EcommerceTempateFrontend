import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";
import { Link } from "react-router-dom";
import logo from '/images/logo.png'


const Footer = () => {
  return (
    <footer className="bg-customBlue py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Subscription */}
        <div className="bg-black md:w-[40%] w-full mx-auto text-white p-6 rounded-lg text-center mb-10">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full p-3 text-black  bg-white rounded-md mb-4"
          />
          <button className="w-full bg-white text-black font-semibold p-3 rounded-md">
            Subscribe to Newsletter
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="font-poppins ">
           <img src={logo} alt="logo" />
            <p className="text-gray-600 mt-2">
              We have clothes that suit your style and which you’re proud to wear.
              From women to men.
            </p>
            <div className="flex gap-4 mt-4">
              <FaTwitter className="text-xl cursor-pointer" />
              <FaFacebookF className="text-xl cursor-pointer" />
              <FaInstagram className="text-xl cursor-pointer" />
              <FaGithub className="text-xl cursor-pointer" />
            </div>
          </div>
          
          {/* Legal */}
          <div className="font-poppins ">
            <h3 className="font-semibold">LEGAL</h3>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>Customer Support</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Company */}
          <div className="font-poppins ">
            <h3 className="font-semibold">COMPANY</h3>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>Delivery Details</li>
              <li>Orders</li>
              <li>Payments</li>
              <li>My Account</li>
            </ul>
          </div>

          {/* Help */}
          <div className="font-poppins ">
            <h3 className="font-semibold">HELP</h3>
            <div className="mt-2 flex flex-col space-y-2 text-gray-600">
              <Link to='/contact-us'>Contact</Link>
             <Link to='/faqs'>FAQs</Link> 
             <Link to='/terms-of-service'>Terms & Conditions </Link>
             <Link to='/general-settings'>Settings </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-center flex-wrap font-poppins ">
          <p className="text-gray-600 text-sm">Shop.co © 2025, All Rights Reserved</p>
          <div className="flex gap-4">
            <SiVisa className="text-2xl text-gray-700" />
            <SiMastercard className="text-2xl text-gray-700" />
            <SiPaypal className="text-2xl text-gray-700" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
