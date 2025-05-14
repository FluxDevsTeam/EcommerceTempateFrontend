import { Link } from "react-router-dom";
import call from './img/call-calling.png';
import location from './img/location.png';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import validator from 'validator';


type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState('');


  const useResponsiveIconSize = () => {
    const [size, setSize] = useState(20);

    useEffect(() => {
      const handleResize = () => {
        setSize(window.innerWidth >= 640 ? 40 : 30);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
  };

  const iconSize = useResponsiveIconSize();

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (formData.firstName.trim().length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters';
    }
    if (formData.lastName.trim().length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters';
    }
    if (!validator.isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    return newErrors;
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
        emailjs.send(
        "service_u0w8c1m",
        'template_wwvqrav',
        {
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            message: formData.message,
        },
        '8-2qWSYToSW4LP7-H'
        ).then((result) => {
        console.log(result.text);
        setSuccessMessage("Message has been sent successfully!");
        setFormData({ firstName: '', lastName: '', email: '', message: '' });

        setTimeout(() => setSuccessMessage(''), 3000);
        }, (error) => {
        console.log(error.text);
        alert("Something went wrong. Please try again.");
        });
    } else {
        setErrors(validationErrors);
    }
    };

  return (
    <div className="w-full min-h-full flex flex-col px-6  md:px-24  py-12 md:py-0 relative">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Contact Us</h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-20 items-start mb-12">
        {successMessage && (
        <div className="absolute top-[35%] left-[20%] mb-6 p-4 rounded bg-green-100 text-green-800 text-sm font-medium shadow">
            {successMessage}
        </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="p-0 border-0 sm:p-8 sm:border sm:border-[#0000000D] rounded-2xl w-full sm:w-[60%]"
        >
          <div className='flex flex-wrap justify-between items-center gap-4 mb-10'>
            <div className="flex flex-col w-full md:w-[30%]">
              <label className="text-[#00000094] mb-2.5">First Name <span className="text-orange-700">*</span></label>
              <input
                type='text'
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, firstName: value });
                    if (errors.firstName && value.trim().length >= 3) {
                    setErrors(prev => ({ ...prev, firstName: undefined }));
                    }
                }}
                className="border border-[#CACACA80] rounded-[10px] py-2 px-5"
                />
              {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>}
            </div>
            <div className="flex flex-col w-full md:w-[30%]">
              <label className="text-[#00000094] mb-2.5">Last Name <span className="text-orange-700">*</span></label>
              <input
                type='text'
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, lastName: value });
                    if (errors.lastName && value.trim().length >= 3) {
                    setErrors(prev => ({ ...prev, lastName: undefined }));
                    }
                }}
                className="border border-[#CACACA80] rounded-[10px] py-2 px-5"
              />
              {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>}
            </div>
            <div className="flex flex-col w-full md:w-[30%]">
              <label className="text-[#00000094] mb-2.5">Email <span className="text-orange-700">*</span></label>
              <input
                type='email'
                placeholder="abc@example.com"
                value={formData.email}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, email: value });
                    if (errors.email && validator.isEmail(value)) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                    }
                }}
                className="border border-[#CACACA80] rounded-[10px] py-2 px-5"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
            </div>
          </div>

          <div className="flex flex-col mb-10">
            <label htmlFor="message" className="text-[#00000094] mb-2.5">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, message: value });
                if (errors.message && value.trim().length >= 10) {
                setErrors(prev => ({ ...prev, message: undefined }));
                }
            }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700 text-sm resize-none h-[120px] sm:h-[200px]"
            ></textarea>
            {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message}</span>}
          </div>

          <button type="submit" className='text-white bg-black w-full p-3 rounded-full block text-center'>
            Send Message
          </button>
        </form>

        <div className="mt-12 md:mt-5 w-full sm:w-[40%]">
          <p className="font-hanken-grotesk font-medium mb-10">
            We’re here to help!<br />Our Customer Service Team is available<br />8am - 5pm, seven days a week.
          </p>
          <div className="mb-8">
            <p className="flex gap-3 items-center">
              <img src={call} alt="call" className="w-[20px] sm:w-[24px]" />
              <span className="font-semibold text-[18px] sm:text-[24px] text-right">Call: +234 700 123 4567</span>
            </p>
            <p className="text-[#333333] mb-0.5">Talk to a Customer Service<br />Representative for help with our site,<br />app, or finding a Redfin Agent.</p>
            <p className="text-[#063AF5]">Email: info@mycaban.com</p>
          </div>
          <div className="mb-8">
            <p className="flex gap-3 items-center">
              <img src={location} alt="location" className="w-[20px] sm:w-[24px]" />
              <span className="font-semibold text-[18px] sm:text-[24px]">Address</span>
            </p>
            <p className="text-[#333333] mb-0.5">Talk to a Customer Service<br />Representative for help with our site,<br />app, or finding a Redfin Agent.</p>
          </div>
          <div>
            <p className="font-semibold text-[20px] sm:text-[24px] text-[#292929] mb-2">Connect with us</p>
            <div className="flex gap-4 sm:gap-6">
              <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={iconSize} />
              </Link>
              <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaXTwitter size={iconSize} />
              </Link>
              <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={iconSize} />
              </Link>
              <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={iconSize} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
