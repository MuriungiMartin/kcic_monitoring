import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://45.149.206.133:6048/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/Survey', {
          headers: {
            'Authorization': 'Basic ' + btoa('Appkings:Appkings@254!')
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }

        const data = await response.json();
        setSurveys(data.value);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FAF46]"></div>
      </div>
    );
  }

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
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-[#5FAF46]">{survey.SurveyCode}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {survey.Status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{survey.Description}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Project:</span>
                <span className="font-medium">{survey.ProjectNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{survey.SurveyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">
                  {new Date(survey.StartDate).toLocaleDateString()} - {new Date(survey.EndDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/questionnaire/${survey.SurveyCode}`)}
              className="w-full mt-4 bg-[#5FAF46] text-white py-2 rounded-md hover:bg-[#4c8c38] transition-colors"
            >
              Take Survey
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surveys; 