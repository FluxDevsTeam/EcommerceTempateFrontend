import { Link } from "react-router-dom";
import CopyablePhone from '@/components/CopyablePhone';

const TermsOfService = () => {
  const termsSection = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using our website or any of our services, you explicitly acknowledge and agree to be bound by these comprehensive terms and conditions. These terms constitute a legally binding agreement between you and Kids Design Company. If you find any aspect of these terms unsatisfactory or disagreeable, we kindly request that you refrain from using our website or services. Regular review of these terms is recommended as they may be updated periodically.",
    },
    {
      title: "Services Provided",
      content:
        "We take pride in offering a comprehensive suite of professional interior design services specifically tailored for children's spaces. Our services encompass detailed mood board creation that helps visualize your perfect space, sophisticated 3D design visuals that bring your ideas to life, and custom furniture production crafted to your exact specifications. Each service is delivered with meticulous attention to detail and a focus on both aesthetics and functionality, ensuring that every child's room we design is not only beautiful but also practical and safe.",
    },
    {
      title: "Eligibility",
      content:
        "You must be over 18 years old to place an order on our website. By using this website, you confirm you meet these eligibility requirements.",
    },
    {
      title: "User Responsibilities",
      content:
        "You agree to use our services and website in accordance with all applicable laws and regulations.",
    },
    {
      title: "Governing Law",
      content:
        "These terms are governed by the laws of Nigeria. Any disputes will be resolved in the relevant courts of Nigeria.",
    },
    {
      title: "Account Responsibility",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. Any actions taken under your account are your responsibility.",
    },
    {
      title: "Account Registration",
      content:
        "To access our services, you may need to create an account. During registration, you must provide accurate and complete information. Your account information will be protected by encryption technology. You are responsible for ensuring your password is kept secure.",
    },
    {
      title: "Product Availability and Pricing",
      content:
        "Products on the site are subject to availability. We will notify you if a product you ordered is out of stock. Prices are clearly displayed on the website and are subject to change without notice. Promotions are offered at our discretion and may be limited by time, quantity, or specific terms.",
    },
    {
      title: "Orders and Payment",
      content:
        "You can place an order directly on our website. Once your order is received, we will confirm your details and proceed with the service or delivery. We accept payments via credit card, debit card, and bank transfer. All payments must be made in full before services are provided or products shipped.",
    },
    {
      title: "Shipping and Delivery",
      content:
        "Delivery times vary depending on your location and the complexity of the order. Generally, expect your items within 7-14 business days. Shipping is calculated at checkout based on the delivery address and the size/weight of the order. We currently offer shipping within Nigeria and select international locations.",
    },
    {
      title: "Return and Exchange",
      content:
        "Returns are accepted only for defective products or those that do not meet the agreed-upon specifications. Returns must be made within 14 days of delivery. The product must be unused and in its original packaging for a return to be accepted.",
    },
    {
      title: "Privacy and Security",
      content:
        "We collect personal data such as your name, address, and email to process your orders and improve our services. Your personal data is used exclusively for processing your orders and communicating with you about your purchases. We use industry-standard encryption to protect your payment details and personal information.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content on this website, including designs, images, and logos, are owned by Kids Design Company and are protected by intellectual property laws. You are not permitted to use, copy, or distribute any content from this site without prior written consent.",
    },
    {
      title: "Limitation of Liability",
      content:
        "We are not responsible for any indirect, incidental, or consequential damages arising from the use of our website or products. We are not liable for the content or privacy practices of any third-party websites linked from our site.",
    },
    {
      title: "Modifications of Terms",
      content:
        "We reserve the right to update or modify these terms at any time. Changes will be posted on this page, and the revised date will be indicated. Any changes to the terms will be communicated to you via email or on the website.",
    },
  ];

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-32 lg:px-64 py-12 md:py-0 font-poppins">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-6">
        Welcome to{" "}
        <span className="font-bold">KIDS DESIGN COMPANY</span>. By accessing or
        using our website or purchasing our products, you agree to comply with
        and be bound by these Terms of Service. Please read them carefully
        before using the Site. If you do not agree with any part of these Terms,
        you may not use the Site.
      </p>

      <div className="space-y pb-30 sm:pb-10">
        {termsSection.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
            <p className="mb-8">{section.content}</p>
          </div>
        ))}

        <div>
          <h2 className="text-xl font-semibold mb-1">Contact Information</h2>
          <p>Email: kidsdesigncompanyng@gmail.com</p>
          <p>Phone: <CopyablePhone phoneNumber="+234 903 123 8704" /></p>
          <p>WhatsApp: <CopyablePhone phoneNumber="+234 903 123 8704" /></p>
          <p>Address: Surulere, Lagos State, Nigeria.</p>
          <p className="mt-8">
            By using our Site or purchasing from{" "}
            <span className="font-bold">KIDS DESIGN COMPANY</span>, you
            acknowledge that you have read, understood, and agreed to these
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
