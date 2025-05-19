import { Link } from "react-router-dom";

const TermsOfService = () => {
  const termsSection = [
    {
      title: "General Terms",
      content:
        "These Terms apply to all users of our Site, including but not limited to browsers, customers, merchants, and contributors of content. By accessing or using the Site, you acknowledge that you have read and understood these Terms, and agree to abide by them. We reserve the right to modify these Terms at any time, and all changes will be posted here. We encourage you to review these Terms periodically.",
    },
    {
      title: "Account Registration",
      content:
        "To make purchases and use certain features on the Site, you may need to create an account. By registering, you agree to provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account details, including your password. You agree to notify us immediately if you suspect any unauthorized use of your account.",
    },
    {
      title: "Product Availability & Pricing",
      content:
        "We strive to ensure that the products displayed on our Site are available and accurately priced. However, pricing and availability are subject to change without notice. We reserve the right to correct any pricing errors and to modify or discontinue products at our discretion. All prices listed are in Naira Currency and may be subject to applicable taxes. Shipping and handling costs are calculated separately and will be added at checkout.",
    },
    {
      title: "Orders & Payment",
      content:
        "When you place an order through our Site, you are offering to purchase a product subject to these Terms. All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability or pricing errors. We accept the following payment methods: credit and debit cards, bank transfers, digital wallets (e-wallets), payment processors and gateways, as well as cryptocurrency payments. Payments are processed securely, and we do not store your payment information.",
    },
    {
      title: "Shipping & Delivery",
      content:
        "We aim to process and ship all orders as quickly as possible. Shipping costs are calculated based on the shipping method and delivery address provided at checkout. You will receive a tracking number once your order has shipped. Please note that delivery times may vary depending on your location. We are not responsible for delays caused by third-party carriers, weather conditions, or other external factors.",
    },
    {
      title: "Returns & Exchanges",
      content:
        "We want you to be completely satisfied with your purchase. If you are not, please refer to our Return & Exchange Policy for instructions on how to return or exchange items. Please note that items must be returned in their original, unused condition with all tags attached. Return shipping costs are the responsibility of the customer, unless the item was defective or incorrect.",
    },
    {
      title: "Privacy & Security",
      content:
        "Your privacy is important to us. We take all necessary steps to protect your personal information and ensure that your shopping experience is safe and secure. For more details, please refer to our Privacy Policy, which explains how we collect, use, and protect your information.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content on this website, including but not limited to logos, designs, text, images, graphics, and software (including product images sourced from third-party retailers or suppliers), is the property of ASL ORIGINALS or its licensors. This content is protected by copyright and intellectual property laws. Unauthorized use, reproduction, or distribution of any material from this site, including product images, is prohibited without prior written permission.",
    },
    {
      title: "Limitation of Liability",
      content:
        "To the fullest extent permitted by law, ASL ORIGINALS is not liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or the purchase of our products. Our total liability is limited to the amount you paid for the product(s) in question.",
    },
    {
      title: "Disclaimers",
      content:
        'We make no representations or warranties of any kind regarding the accuracy, completeness, or reliability of the information on this Site or the products sold. While we make every effort to ensure that our products are described accurately, errors may occur. The products are sold "as-is" and without any warranties, either express or implied.',
    },
    {
      title: "Indemnification",
      content:
        "You agree to indemnify and hold harmless ASL ORIGINALS, its officers, directors, employees, and affiliates from any claims, damages, or liabilities arising from your use of the Site, your breach of these Terms, or your violation of any applicable laws.",
    },
    {
      title: "Modifications to Terms",
      content:
        "We may revise these Terms from time to time, and all changes will be posted on this page with an updated effective date. If you continue using the Site after changes have been made, this constitutes your acceptance of the updated Terms.",
    },
  ];

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-32 lg:px-64 py-12 md:py-0 font-poppins">

      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-6">
        Welcome to <span className="font-bold">KIDS DESIGN COMPANY</span>. By accessing or using our website or
        purchasing our products, you agree to comply with and be bound by these
        Terms of Service. Please read them carefully before using the Site. If
        you do not agree with any part of these Terms, you may not use the Site.
      </p>

      <div className="space-y pb-30 sm:pb-10">
        {termsSection.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}

        <div>
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <p>Email: kidsdesigncompanyng@gmail.com</p>
          <p>Phone: +234 806 322 4027</p>
          <p>WhatsApp: +234 806 322 4027</p>
          <p>Address: Surulere, Lagos State, Nigeria.</p>
          <p className="mt-4">
            By using our Site or purchasing from <span className="font-bold">KIDS DESIGN COMPANY</span>, you
            acknowledge that you have read, understood, and agreed to these
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
