import { useState, useEffect } from 'react';

const MyQuestionnaires = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('http://45.149.206.133:6048/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/answers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Appkings:Appkings@254!'),
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      const data = await response.json();
      console.log('API Response:', data);
      
      // Get user email from session storage
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      console.log('User Data:', userData);
      const userEmail = userData?.email;

      // Filter and group surveys by Survey_Name
      const groupedSurveys = data.value.reduce((acc, survey) => {
        if (survey.Answered_By_Email === userEmail) {
          const key = survey.Survey_Name;
          if (!acc[key]) {
            acc[key] = {
              name: key,
              code: survey.Survey_Code,
              periodFrom: survey.Period_From,
              periodTo: survey.Period_To,
              quizNo: survey.Quiz_No,
              answers: []
            };
          }
          acc[key].answers.push({
            question: survey.Question || `Question ${survey.Quiz_No}`,
            answer: survey.Text_Answer || survey.Boolean_Answer || survey.Number_Answer,
            answeredDate: new Date(survey.Answered_Date).toLocaleDateString(),
            questionType: survey.Question_Type,
            quizNo: survey.Quiz_No
          });
        }
        return acc;
      }, {});

      console.log('Grouped Surveys:', groupedSurveys);
      setSurveys(Object.values(groupedSurveys));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError('Failed to load surveys');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FAF46]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfcfc] to-[#f0f7f0] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Questionnaires</h1>
        
        {!loading && surveys.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600">No questionnaires found.</p>
          </div>
        )}
        
        {selectedSurvey ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedSurvey.name}</h2>
                <p className="text-sm text-gray-600 mt-1">Quiz {selectedSurvey.quizNo}</p>
              </div>
              <button
                onClick={() => setSelectedSurvey(null)}
                className="text-[#5FAF46] hover:text-[#4a9339] font-medium"
              >
                Back to Surveys
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Period:</span>{' '}
                  {new Date(selectedSurvey.periodFrom).toLocaleDateString()} - {new Date(selectedSurvey.periodTo).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Survey Code:</span> {selectedSurvey.code}
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedSurvey.answers.map((answer, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900 mb-2">{answer.question || `Question ${index + 1}`}</p>
                    <p className="text-gray-600">{answer.answer.toString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Answered on: {answer.answeredDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedSurvey(survey)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{survey.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Quiz {survey.quizNo}</p>
                <div className="text-sm text-gray-600">
                  <p>Period: {new Date(survey.periodFrom).toLocaleDateString()} - {new Date(survey.periodTo).toLocaleDateString()}</p>
                  <p>Questions Answered: {survey.answers.length}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="text-[#5FAF46] hover:text-[#4a9339] font-medium text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSurvey(survey);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuestionnaires; 