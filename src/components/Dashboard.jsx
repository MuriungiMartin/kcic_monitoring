const Dashboard = () => {
  return (
    <div className="p-4 md:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome to KCIC Monitoring Portal</h1>
        <p className="text-gray-600 mt-2">Track and manage your project surveys and questionnaires</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-800">24</h3>
            </div>
            <div className="bg-[#5FAF46]/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-[#5FAF46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold">↑ 12%</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Surveys</p>
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold">↑ 4</span>
            <span className="text-gray-400 text-sm ml-2">new this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Surveys</p>
              <h3 className="text-2xl font-bold text-gray-800">156</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold">↑ 24%</span>
            <span className="text-gray-400 text-sm ml-2">completion rate</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-500 text-sm font-semibold">4 urgent</span>
            <span className="text-gray-400 text-sm ml-2">need attention</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "Survey Completed", project: "DEERFIELD, 8 WP", time: "2 hours ago", status: "completed" },
            { action: "New Survey Started", project: "AgriBusiness Project", time: "5 hours ago", status: "ongoing" },
            { action: "Review Submitted", project: "Clean Energy Initiative", time: "1 day ago", status: "reviewed" },
            { action: "Survey Updated", project: "Water Management", time: "2 days ago", status: "updated" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'ongoing' ? 'bg-blue-500' :
                  activity.status === 'reviewed' ? 'bg-purple-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.project}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-[#5FAF46] text-white rounded-md hover:bg-[#4c8c38] transition-colors">
              Start New Survey
            </button>
            <button className="w-full py-2 px-4 border border-[#5FAF46] text-[#5FAF46] rounded-md hover:bg-[#5FAF46] hover:text-white transition-colors">
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Project Review</span>
              <span className="text-sm text-red-500">Tomorrow</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Survey Completion</span>
              <span className="text-sm text-yellow-500">In 3 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm text-green-500">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;