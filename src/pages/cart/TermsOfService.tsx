import { Link } from "react-router-dom";
import CopyablePhone from '@/components/CopyablePhone';

const TermsOfService = () => {
  const termsSection = [
    {
      title: "Demo Website Only",
      content:
        "SHOP is not a real e-commerce website. It is a demo template meant to showcase design and functionality. Any checkout, payment, or product display is non-functional and should not be considered as a real transaction."
    },
    {
      title: "No Real Transactions",
      content:
        "You cannot purchase or order any products on this site. Any attempt to do so will not result in an actual sale, as all items are fictitious."
    },
    {
      title: "Intellectual Property",
      content:
        "All logos, designs, and content displayed on this demo website belong to FluxDevs or their respective owners. You may not copy, reuse, or distribute any material without prior permission."
    },
    {
      title: "Limitation of Liability",
      content:
        "FluxDevs will not be held liable for any misunderstandings, assumptions, or damages arising from the use of this demo website. Use of this site is solely for demonstration and learning purposes."
    },
    {
      title: "Governing Law",
      content:
        "These demo Terms of Service are governed by the laws of Nigeria. Any disputes will be subject to the jurisdiction of Nigerian courts."
    },
    {
      title: "Modifications of Terms",
      content:
        "FluxDevs reserves the right to update or modify these Terms of Service for the demo site at any time. Updates will be reflected on this page."
    }
  ];

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-32 lg:px-64 py-12 md:py-0 font-poppins">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-6">
        Welcome to{" "}
        <span className="font-bold">SHOP</span>. By accessing and using this demo website, 
        you acknowledge and agree that SHOP is a sample e-commerce platform created by
         FluxDevs for marketing and presentation purposes only. All products, prices,
          and descriptions are fictitious and not for sale.

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
          <p>Email: fluxdevs.company@gmail.com</p>
          <p>Phone: <CopyablePhone phoneNumber="+234 916 409 7582" /></p>
          <p>WhatsApp: <CopyablePhone phoneNumber="+234 916 409 7582" /></p>
          <p>Address: Lagos State, Nigeria.</p>
          <p className="mt-8">
            By using our Site or purchasing from{" "}
            <span className="font-bold">SHOP</span>, you
            acknowledge that you have read, understood, and agreed to these
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
