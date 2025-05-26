import { useState } from "react";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "How do I create an account?",
      answer:
      'To create an account, simply click on the Sign In button at the top right corner of the website. On the Sign In page, select "Create an Account" or "Sign Up", then fill in your details and follow the prompts. Once completed, your account will be created and you can start using our services right away.',
      isOpen: true,
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is placed, you will receive a tracking link via email/SMS. You can also track it from your dashboard under My Orders",
      isOpen: false,
    },
    {
      question: "How long does shipping take?",
      answer:
        "Delivery times vary based on your location and the seller. Standard shipping takes 3-7 business days, while express shipping takes 1-3 business days.",
      isOpen: false,
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Once your order is placed, you will receive a tracking link via email/SMS. You can also track it from your dashboard under My Orders",
      isOpen: false,
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Once your order is placed, you will receive a tracking link via email/SMS. You can also track it from your dashboard under My Orders",
      isOpen: false,
    },
  ]);

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
