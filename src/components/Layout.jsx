import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const Layout = () => {
  const [userData, setUserData] = useState({
    name: '',
    image: ''
  });
  const location = useLocation();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <img src="https://www.kenyacic.org/wp-content/uploads/2024/01/KCIC-logo.png" alt="KCIC" className="h-16 mb-16" />
        </div>
        <nav className="mt-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-6 py-3 ${
              location.pathname === '/dashboard' 
                ? 'text-[#5FAF46] bg-[#5FAF46]/10' 
                : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
            } transition-colors`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link 
            to="/surveys" 
            className={`flex items-center px-6 py-3 ${
              location.pathname === '/surveys' 
                ? 'text-[#5FAF46] bg-[#5FAF46]/10' 
                : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
            } transition-colors`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Surveys
          </Link>
          <Link 
            to="/questionnaire" 
            className={`flex items-center px-6 py-3 ${
              location.pathname === '/questionnaire' 
                ? 'text-[#5FAF46] bg-[#5FAF46]/10' 
                : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
            } transition-colors`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Questionnaire
          </Link>
          <Link 
            to="/faqs" 
            className={`flex items-center px-6 py-3 ${
              location.pathname === '/faqs' 
                ? 'text-[#5FAF46] bg-[#5FAF46]/10' 
                : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
            } transition-colors`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQs
          </Link>
          <Link 
            to="/contact" 
            className={`flex items-center px-6 py-3 ${
              location.pathname === '/contact' 
                ? 'text-[#5FAF46] bg-[#5FAF46]/10' 
                : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
            } transition-colors`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center px-6 py-3 text-gray-600 hover:bg-[#5FAF46] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation Bar */}
        <div className="border-b">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to Search .."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#5FAF46]"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-[#5FAF46]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{userData.name || 'User'}</span>
                  <span className="text-sm text-gray-500">KENYA</span>
                </div>
                {userData.image ? (
                  <img
                    src={`data:image/jpeg;base64,${userData.image}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-[#5FAF46] object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-[#5FAF46] bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout; 