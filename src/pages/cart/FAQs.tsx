import { useState } from "react";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string | JSX.Element; // Update interface to accept JSX
  isOpen: boolean;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(
    [
      {
        question: "What services do you offer?",
        answer:
          "We provide expert interior design for children's spaces, including room makeovers, furniture production, and personalized consultation. We also offer decor accessories like rugs, throw pillows, and lamps. Each piece is selected with both aesthetics and functionality in mind, ensuring your child's space is beautiful and safe.",
        isOpen: true,
      },
      {
        question: "How can I book a consultation?",
        answer: (
          <span>
            Kindly go to our{" "}
            <Link to="/contact-us" className="text-blue-600 hover:underline">
              contact us page
            </Link>
            {" "}and send us a message through the means available. You can choose between a physical in-person consultation at your location, or a virtual consultation via video call. Both options require a secure payment to confirm your booking. Our team will discuss your vision, requirements, and budget during the consultation.",
          </span>
        ),
        isOpen: false,
      },
      {
        question: "What is the turnaround time for room design projects?",
        answer:
          "For custom furniture and room makeovers, delivery takes 2-6 weeks. For non-furniture products that don't need production time, delivery takes 3-7 days depending on distance. Delivery time varies based on quantity, weight, and size. You can see the exact delivery date in the checkout section before payment.",
        isOpen: false,
      },
      {
        question: "Do you offer delivery for furniture or room makeovers?",
        answer:
          "Yes, we offer delivery for all our furniture items and complete room makeovers. Choose between delivery-only service or full installation with professional setup. Our team ensures careful handling during transport and setup.",
        isOpen: false,
      },
      {
        question: "Can I customize the designs?",
        answer:
          "Absolutely! We specialize in creating custom-made designs tailored to your child's unique needs, preferences, and the specific requirements of your space. Our design process is highly collaborative, ensuring that you are involved and informed at every step. We encourage you to share your ideas, inspiration, and any specific requests you may have. Our goal is to bring your vision to life while providing professional guidance and expertise.",
        isOpen: false,
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order has been processed and shipped, you will receive an email notification containing tracking details and a tracking number. This allows you to monitor the status of your shipment in real-time. If you have any questions or concerns about your order, feel free to contact our customer service team for assistance.",
        isOpen: false,
      },
      {
        question: "What is your refund policy?",
        answer:
          "We stand behind the quality of our products and services. Refunds are available for defective items or services that were not delivered as promised. If you receive a defective item or if there was an error in your order, please contact us within 7 days of delivery to initiate a refund or replacement. Please note that returns for non-defective products are not accepted after delivery. For more detailed information, please refer to our Refund Policy page on the website.",
        isOpen: false,
      },
    ]
  );

  const toggleFAQ = (index: number) => {
    setFaqs(
      faqs.map((faq, i) =>
        i === index
          ? { ...faq, isOpen: !faq.isOpen }
          : { ...faq, isOpen: false }
      )
    );
  };

  return (
    <div className="w-full min-h-full flex flex-col px-6  md:px-24  py-12 md:py-0 mb-6 font-poppins">
     

      <h1 className="text-3xl font-bold mb-8">Frequently asked Questions</h1>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b-2">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-4 flex justify-between items-center"
            >
              <span className="font-semibold">{faq.question}</span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  faq.isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {faq.isOpen && faq.answer && (
              <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
