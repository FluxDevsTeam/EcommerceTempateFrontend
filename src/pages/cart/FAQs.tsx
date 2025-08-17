import { useState } from "react";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
  isOpen: boolean;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(
    [
      {
        question: "Is SHOP a real online store?",
        answer:
          "No. SHOP is a demo e-commerce website created by FluxDevs for marketing and presentation purposes only. All products, prices, and descriptions shown here are fictitious and not for sale.",
        isOpen: true
      },
      {
        question: "Can I place an order on SHOP?",
        answer:
          "No. The checkout and payment sections are non-functional and exist only for demonstration purposes. You cannot actually buy anything from this site.",
        isOpen: false
      },
      {
        question: "Are the products real?",
        answer:
          "No. Every product you see on SHOP, including descriptions, images, and prices, is fictional and included only to showcase design and layout.",
        isOpen: false
      },
      {
        question: "Why was SHOP created?",
        answer:
          "SHOP was created by FluxDevs as a sample e-commerce template to demonstrate how an online store could look and function. It is not intended for real commercial use.",
        isOpen: false
      },
      {
        question: "Can I reuse this template?",
        answer:
          "No. It is a property of FLUXDEVS",
        isOpen: false
      },
      {
        question: "Is my personal data collected?",
        answer:
          "No real personal data is collected on this demo website. Any forms or inputs are placeholders and do not store information.",
        isOpen: false
      },
      {
        question: "Who owns SHOP?",
        answer:
          "SHOP is owned and maintained by FluxDevs as a sample project. It does not represent a real business or company offering products for sale.",
        isOpen: false
      }
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
