import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Questionnaire = () => {
  const { surveyCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [drillDownChoices, setDrillDownChoices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questions
        const questionsResponse = await fetch(
          '/odata/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/Questions',
          {
            headers: {
              'Authorization': 'Basic ' + btoa('Appkings:Appkings@254!'),
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }

        const questionsData = await questionsResponse.json();
        
        // Filter questions for the specific survey and sort them
        const filteredQuestions = questionsData.value
          .filter(q => q.SurveyCode === surveyCode)
          .sort((a, b) => {
            const categoryOrder = { 'Summary': 1, 'Header': 2, 'Question': 3 };
            if (a.QuizNo === b.QuizNo) {
              return categoryOrder[a.QuestionCategory] - categoryOrder[b.QuestionCategory];
            }
            return a.QuizNo - b.QuizNo;
          });

        // Only fetch drill-down answers if we have questions that need them
        const questionsNeedingChoices = filteredQuestions.filter(q => 
          q.RequiresDrillDown && 
          (q.QuestionType === 'Single Choice' || q.QuestionType === 'Multiple Choice')
        );

        if (questionsNeedingChoices.length > 0) {
          const choicesResponse = await fetch(
            '/odata/KCICCTEST/ODataV4/Company(\'CRONUS%20International%20Ltd.\')/DrillDownAnswers',
            {
              headers: {
                'Authorization': 'Basic ' + btoa('Appkings:Appkings@254!'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );

          if (!choicesResponse.ok) {
            throw new Error('Failed to fetch choices');
          }

          const choicesData = await choicesResponse.json();

          // Organize drill-down choices by QuizNo
          const choicesMap = {};
          choicesData.value.forEach(choice => {
            // Only include choices that match the survey code and project number
            const matchingQuestion = filteredQuestions.find(q => q.QuizNo === choice.QuizNo);
            if (matchingQuestion && 
                (choice.AuxiliaryIndex1 === '' || choice.AuxiliaryIndex1 === surveyCode) && 
                choice.ProjectNo === matchingQuestion.ProjectNo) {
              if (!choicesMap[choice.QuizNo]) {
                choicesMap[choice.QuizNo] = [];
              }
              choicesMap[choice.QuizNo].push(choice);
            }
          });

          // Sort choices by AuxiliaryIndex2
          Object.keys(choicesMap).forEach(quizNo => {
            choicesMap[quizNo].sort((a, b) => a.AuxiliaryIndex2 - b.AuxiliaryIndex2);
          });

          setDrillDownChoices(choicesMap);
        }

        setQuestions(filteredQuestions);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyCode]);

  const validateAnswers = (questionsToValidate) => {
    const errors = {};
    questionsToValidate.forEach(question => {
      if (question.Mandatory && question.QuestionCategory === 'Question') {
        const answer = answers[question.QuizNo];
        const isEmpty = 
          answer === undefined || 
          answer === '' || 
          (Array.isArray(answer) && answer.length === 0);
        
        if (isEmpty) {
          errors[question.QuizNo] = 'This field is required';
        }
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (quizNo, value) => {
    setAnswers(prev => ({
      ...prev,
      [quizNo]: value
    }));
    // Clear validation error when field is filled
    if (validationErrors[quizNo]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[quizNo];
        return newErrors;
      });
    }
  };

  const renderQuestionInput = (question) => {
    const commonProps = {
      disabled: isSubmitted,
      className: `w-full p-2 border rounded-md focus:outline-none focus:border-[#5FAF46] ${
        isSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
      } ${validationErrors[question.QuizNo] ? 'border-red-500' : ''}`
    };

    switch (question.QuestionType) {
      case 'Text':
        return (
          <input
            type="text"
            value={answers[question.QuizNo] || ''}
            onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
            {...commonProps}
          />
        );

      case 'Number':
        return (
          <input
            type="number"
            value={answers[question.QuizNo] || ''}
            onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
            {...commonProps}
          />
        );

      case 'Date':
        return (
          <input
            type="date"
            value={answers[question.QuizNo] || ''}
            onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
            {...commonProps}
          />
        );

      case 'Single Choice':
        return (
          <select
            value={answers[question.QuizNo] || ''}
            onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
            {...commonProps}
          >
            <option value="">Select an option</option>
            {drillDownChoices[question.QuizNo]?.map(choice => (
              <option key={choice.AuxiliaryIndex2} value={choice.Choice}>
                {choice.Choice}
              </option>
            ))}
          </select>
        );

      case 'Multiple Choice':
        return (
          <div className="space-y-2">
            {drillDownChoices[question.QuizNo]?.map(choice => (
              <label key={choice.AuxiliaryIndex2} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers[question.QuizNo]?.includes(choice.Choice)}
                  onChange={(e) => {
                    const currentAnswers = answers[question.QuizNo] || [];
                    if (e.target.checked) {
                      handleInputChange(question.QuizNo, [...currentAnswers, choice.Choice]);
                    } else {
                      handleInputChange(
                        question.QuizNo,
                        currentAnswers.filter(a => a !== choice.Choice)
                      );
                    }
                  }}
                  disabled={isSubmitted}
                  className={`form-checkbox text-[#5FAF46] ${
                    isSubmitted ? 'cursor-not-allowed' : ''
                  }`}
                />
                <span>{choice.Choice}</span>
              </label>
            ))}
          </div>
        );

      case 'Yes/No':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${question.QuizNo}`}
                value="Yes"
                checked={answers[question.QuizNo] === 'Yes'}
                onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
                disabled={isSubmitted}
                className={`form-radio text-[#5FAF46] ${
                  isSubmitted ? 'cursor-not-allowed' : ''
                }`}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${question.QuizNo}`}
                value="No"
                checked={answers[question.QuizNo] === 'No'}
                onChange={(e) => handleInputChange(question.QuizNo, e.target.value)}
                disabled={isSubmitted}
                className={`form-radio text-[#5FAF46] ${
                  isSubmitted ? 'cursor-not-allowed' : ''
                }`}
              />
              <span>No</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const getCurrentQuestions = () => {
    const startIndex = currentStep * questionsPerPage;
    return questions.slice(startIndex, startIndex + questionsPerPage);
  };

  const totalSteps = Math.ceil(questions.length / questionsPerPage);

  const handleNext = () => {
    const currentQuestions = getCurrentQuestions();
    if (validateAnswers(currentQuestions)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      alert('Please fill in all mandatory fields before proceeding');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all questions before submission
    if (!validateAnswers(questions)) {
      alert('Please fill in all mandatory fields before submitting');
      return;
    }

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the survey? Once submitted, you won't be able to make changes."
    );

    if (!confirmSubmit) {
      return;
    }

    setLoading(true);

    try {
      // Get user data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      
      // Process each answer
      for (const [quizNo, value] of Object.entries(answers)) {
        const question = questions.find(q => q.QuizNo === parseInt(quizNo));
        if (!question) continue;

        // For multiple choice answers, handle each selection
        if (Array.isArray(value)) {
          for (const choice of value) {
            await submitAnswer(question, choice, userData);
          }
        } else {
          await submitAnswer(question, value, userData);
        }
      }

      setIsSubmitted(true);
      alert('Survey submitted successfully');
    } catch (err) {
      setError('Failed to submit survey: ' + err.message);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (question, value, userData) => {
    return new Promise((resolve, reject) => {
      let boolAnswer = 'false';
      let txtAnswer = '';
      let numberAnswer = 0;

      switch (question.QuestionType) {
        case 'Yes/No':
          boolAnswer = value === 'Yes' ? 'true' : 'false';
          break;
        case 'Number':
          numberAnswer = value ? parseFloat(value) : 0;
          break;
        case 'Text':
        case 'Single Choice':
        case 'Multiple Choice':
        case 'Date':
          txtAnswer = value || '';
          break;
        default:
          txtAnswer = '';
      }

      const soapRequest = `
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
          <Body>
            <SubmitQuizAnswers xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
              <projectNo>${question.ProjectNo}</projectNo>
              <quiZNo>${question.QuizNo}</quiZNo>
              <boolAnswer>${boolAnswer}</boolAnswer>
              <txtAnswer>${txtAnswer}</txtAnswer>
              <numberAnswer>${numberAnswer}</numberAnswer>
              <submitedByName>${userData?.name || ''}</submitedByName>
              <submitedByEmail>${userData?.email || ''}</submitedByEmail>
              <surveyCode>${surveyCode}</surveyCode>
            </SubmitQuizAnswers>
          </Body>
        </Envelope>`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions', true);
      
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader('SOAPAction', 'SubmitQuizAnswers');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (xhr.responseText.includes('s:Fault')) {
              const errorMatch = xhr.responseText.match(/<faultstring[^>]*>(.*?)<\/faultstring>/);
              const errorMessage = errorMatch ? errorMatch[1] : 'Unknown SOAP error';
              reject(new Error(errorMessage));
            } else {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error(`Failed to submit answer for question ${question.QuizNo}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = function() {
        reject(new Error('Network error occurred'));
      };

      xhr.send(soapRequest);
    });
  };

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
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {isSubmitted && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          This survey has been submitted and can no longer be edited.
        </div>
      )}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Questions marked with an asterisk (<span className="text-red-500">*</span>) are mandatory.</li>
          <li>• Please complete all questions on the current page before proceeding to the next.</li>
          <li>• Your responses will be saved only after final submission.</li>
        </ul>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 md:space-y-8">
        {getCurrentQuestions().map((question) => (
          <div key={question.QuizNo} className="space-y-3 md:space-y-4">
            {question.QuestionCategory === 'Summary' || question.QuestionCategory === 'Header' ? (
              <h2 className="text-lg md:text-xl font-bold text-[#5FAF46] break-words">
                {question.Question}
              </h2>
            ) : (
              <div className="space-y-2">
                <label className="block font-medium text-sm md:text-base break-words">
                  {question.Question}
                  {question.Mandatory && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestionInput(question)}
                {validationErrors[question.QuizNo] && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[question.QuizNo]}</p>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
          <div className="flex space-x-4 w-full md:w-auto">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitted}
              className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base border border-[#5FAF46] rounded-md transition-colors ${
                currentStep === 0 || isSubmitted
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-[#5FAF46] hover:bg-[#5FAF46] hover:text-white'
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === totalSteps - 1 || isSubmitted}
              className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base border border-[#5FAF46] rounded-md transition-colors ${
                currentStep === totalSteps - 1 || isSubmitted
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-[#5FAF46] hover:bg-[#5FAF46] hover:text-white'
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-600 order-first md:order-none w-full md:w-auto text-center">
            Page {currentStep + 1} of {totalSteps}
          </div>

          {currentStep === totalSteps - 1 && !isSubmitted && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={`w-full md:w-auto px-4 py-2 bg-[#5FAF46] text-white rounded-md transition-colors text-sm md:text-base ${
                isSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4c8c38]'
              }`}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;