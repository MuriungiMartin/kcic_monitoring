import { useState } from 'react';

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is KCIC Monitoring System?",
      answer: "KCIC Monitoring System is a platform designed to track and evaluate the progress of projects and initiatives supported by the Kenya Climate Innovation Center."
    },
    {
      question: "How do I submit my project updates?",
      answer: "You can submit project updates through the Surveys section after logging into your account. Fill in the required information and submit the form to update your project status."
    },
    {
      question: "How often should I update my project status?",
      answer: "Project status should be updated on a monthly basis, or as specified in your project agreement with KCIC."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, please contact the KCIC support team through the Contact Us page or email support@kenyacic.org for assistance."
    },
    {
      question: "Can I edit my submitted survey responses?",
      answer: "Once a survey is submitted, it cannot be edited. Please ensure all information is accurate before submission. Contact support if you need to make corrections."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Find answers to common questions about KCIC Monitoring System
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none flex justify-between items-center"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-[#5FAF46] transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 bg-gray-50 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs; 