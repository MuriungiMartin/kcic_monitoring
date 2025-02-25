import { useState, useEffect } from 'react';

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Create Basic Auth header
        const credentials = btoa('Appkings:Appkings@254!'); 
        
        const response = await fetch('/odata/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/Faqs', {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        const data = await response.json();
        setFaqs(data.value);
      } catch (err) {
        setError('Failed to load FAQs');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          Loading FAQs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

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
            {faqs.map((faq) => (
              <div
                key={faq.EntryNo}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none flex justify-between items-center"
                  onClick={() => setOpenIndex(openIndex === faq.EntryNo ? null : faq.EntryNo)}
                >
                  <span className="font-medium text-gray-900">{faq.Question}</span>
                  <svg
                    className={`w-5 h-5 text-[#5FAF46] transform transition-transform ${
                      openIndex === faq.EntryNo ? 'rotate-180' : ''
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
                {openIndex === faq.EntryNo && (
                  <div className="px-4 py-3 bg-gray-50 text-gray-600">
                    {faq.Answer}
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