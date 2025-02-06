import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filledSurveys, setFilledSurveys] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Move cache check inside useEffect
    const cachedData = sessionStorage.getItem('surveyData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setSurveys(data);
        setLoading(false);
        return;
      }
    }

    const checkSurveyStatus = async (surveyCode) => {
      return new Promise((resolve, reject) => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const soapRequest = `
          <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
              <isSurveyfilledByEmail xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
                <email>${userData?.email || ''}</email>
                <surveyCode>${surveyCode}</surveyCode>
              </isSurveyfilledByEmail>
            </Body>
          </Envelope>`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions', true);
        xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
        xhr.setRequestHeader('SOAPAction', 'isSurveyfilledByEmail');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              if (xhr.responseText.includes('s:Fault')) {
                const errorMatch = xhr.responseText.match(/<faultstring[^>]*>(.*?)<\/faultstring>/);
                const errorMessage = errorMatch ? errorMatch[1] : 'Unknown SOAP error';
                reject(new Error(errorMessage));
              } else {
                const isFilled = xhr.responseText.includes('true');
                setFilledSurveys(prev => ({ ...prev, [surveyCode]: isFilled }));
                resolve(isFilled);
              }
            } else {
              reject(new Error(`Failed to check survey status for ${surveyCode}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.send(soapRequest);
      });
    };

    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://45.149.206.133:6048/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/Survey', {
          headers: {
            'Authorization': 'Basic ' + btoa('Appkings:Appkings@254!')
          }
        });

        if (!response.ok) throw new Error('Failed to fetch surveys');

        const data = await response.json();
        setSurveys(data.value);
        setLoading(false); // Show surveys immediately

        // Check statuses in batches
        const batchSize = 3;
        for (let i = 0; i < data.value.length; i += batchSize) {
          const batch = data.value.slice(i, i + batchSize);
          await Promise.all(batch.map(survey => 
            checkSurveyStatus(survey.SurveyCode).catch(err => {
              console.error(`Error checking survey ${survey.SurveyCode}:`, err);
              return false; // Default to not filled on error
            })
          ));
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Published Surveys</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <div 
            key={survey.SurveyCode} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-[#5FAF46]">{survey.SurveyCode}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {survey.Status}
              </span>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">{survey.Description}</p>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Project:</span>
                <span className="font-medium col-span-2 text-right">{survey.ProjectNo}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium col-span-2 text-right">{survey.SurveyType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium col-span-2 text-right">
                  {new Date(survey.StartDate).toLocaleDateString()} - {new Date(survey.EndDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/questionnaire/${survey.SurveyCode}`)}
              className={`w-full mt-4 py-2 rounded-md transition-colors ${
                filledSurveys[survey.SurveyCode]
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#5FAF46] hover:bg-[#4c8c38] text-white'
              }`}
              disabled={filledSurveys[survey.SurveyCode]}
            >
              {filledSurveys[survey.SurveyCode] ? 'Already Completed' : 'Take Survey'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surveys; 