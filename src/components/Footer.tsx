import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from '/images/full_logo.png'


const Footer = () => {
  return (
    <footer className="bg-gray-100 pb-10 px-6">
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

        <div className="flex max-md:flex-col justify-evenly">
          {/* Shop Info */}
          <div className="font-poppins">
           <img src={logo} alt="logo" className="h-10"/>
            <p className="text-gray-600 mt-2">
              We don't just design spaces,we <br className="max-md:hidden"/> define Destinies
            </p>
            <div className="flex gap-4 mt-4">
              <a 
                href="https://www.instagram.com/kidsdesigncompany" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition-colors"
              >
                <FaInstagram className="text-xl cursor-pointer" />
              </a>
              <a 
                href="https://www.facebook.com/kidsdesigncompanyng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <FaFacebookF className="text-xl cursor-pointer" />
              </a>
              <a 
                href="https://www.tiktok.com/@kidsdesigncompanyng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                <FaTiktok className="text-xl cursor-pointer" />
              </a>
            </div>
          </div>
          
          {/* Legal */}
          <div className="font-poppins max-md:mt-5">
            <h3 className="font-semibold">LEGAL</h3>
            {/* <div className="mt-2 space-y-2 text-gray-600"> */}
            <div className="mt-2 flex flex-col space-y-2 text-gray-600">

              <Link to='/contact-us'>Customer Support</Link>
              <Link to='/terms-of-service'>Privacy Policy</Link>
            </div>
          </div>

          {/* Help */}
          <div className="font-poppins max-md:mt-5">
            <h3 className="font-semibold">HELP</h3>
            <div className="mt-2 flex flex-col space-y-2 text-gray-600">
              <Link to='/contact-us'>Contact</Link>
             <Link to='/faqs'>FAQs</Link> 
             <Link to='/terms-of-service'>Terms & Conditions </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center font-poppins ">
          <p className="text-gray-600 text-sm">Shop  © {new Date().getFullYear()}, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
