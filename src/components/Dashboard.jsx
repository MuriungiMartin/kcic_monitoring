import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const loginUrl = `${baseUrl}/KCIC/WS/KCIC%20LIVE/Codeunit/ProjectQuestions`;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', loginUrl, true);
        
        // Set headers matching the working example
        xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
        xhr.setRequestHeader('SOAPAction', 'GetDashboardStatistics');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              if (xhr.responseText.includes('s:Fault')) {
                const errorMatch = xhr.responseText.match(/<faultstring[^>]*>(.*?)<\/faultstring>/);
                const errorMessage = errorMatch ? errorMatch[1] : 'Unknown SOAP error';
                console.error(errorMessage);
                setLoading(false);
              } else {
                // Parse the SOAP XML response
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                
                // Extract the return_value which contains the JSON string
                const returnValue = xmlDoc.querySelector('return_value').textContent;
                
                // Parse the JSON string into an object
                const data = JSON.parse(returnValue);
                setDashboardData(data);
                setLoading(false);
              }
            } else {
              console.error('Request failed with status:', xhr.status);
              setLoading(false);
            }
          }
        };

        xhr.onerror = function() {
          console.error('Error fetching dashboard data');
          setLoading(false);
        };

        const soapEnvelope = `
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
          <Body>
              <GetDashboardStatistics xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions"/>
          </Body>
        </Envelope>`;

        xhr.send(soapEnvelope);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="p-4 text-center">Error loading dashboard data</div>;
  }

  return (
    <div className="p-2 md:p-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome to KCIC Monitoring Portal</h1>
        <p className="text-gray-600 mt-1">Track and manage your project surveys and questionnaires</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-800">{dashboardData.totalProjects}</h3>
            </div>
            <div className="bg-[#5FAF46]/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-[#5FAF46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-semibold ${dashboardData.projectGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {dashboardData.projectGrowth > 0 ? '↑' : '↓'} {Math.abs(dashboardData.projectGrowth)}%
            </span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Surveys</p>
              <h3 className="text-2xl font-bold text-gray-800">{dashboardData.activeSurveys}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold">↑ {dashboardData.newSurveysThisWeek}</span>
            <span className="text-gray-400 text-sm ml-2">new this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Surveys</p>
              <h3 className="text-2xl font-bold text-gray-800">{dashboardData.completedSurveys}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold">↑ {dashboardData.surveyGrowth}%</span>
            <span className="text-gray-400 text-sm ml-2">completion rate</span>
          </div>
        </div>

{/*         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-gray-800">{dashboardData.pendingReviews}</h3>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-500 text-sm font-semibold">{dashboardData.urgentReviews} urgent</span>
            <span className="text-gray-400 text-sm ml-2">need attention</span>
          </div>
        </div> */}
      </div>

      {/* Recent Activity and Quick Actions in 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h2>
          <div className="space-y-2">
            {dashboardData.recentActivity.slice(0, 4).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'Survey Answer' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.project}</p>
                    <p className="text-xs text-gray-400">{activity.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Dashboard;