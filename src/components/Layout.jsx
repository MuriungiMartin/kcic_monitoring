import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, ClipboardDocumentListIcon, DocumentTextIcon, QuestionMarkCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const [userData, setUserData] = useState({
    name: '',
    image: ''
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userData');
    window.location.href = '/login';
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Surveys', href: '/surveys', icon: ClipboardDocumentListIcon },
    { name: 'My Questionnaires', href: '/my-questionnaires', icon: DocumentTextIcon },
    { name: 'FAQs', href: '/faqs', icon: QuestionMarkCircleIcon },
    { name: 'Contact Us', href: '/contact', icon: PhoneIcon },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static w-64 bg-gradient-to-b from-[#e2f7dc] via-[#f0f8ee] to-green-50 min-h-screen border-r z-30 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4">
          <img src="https://www.kenyacic.org/wp-content/uploads/2024/01/KCIC-logo.png" alt="KCIC" className="h-16 mb-16" />
        </div>
        <nav className="mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 ${
                location.pathname === item.href
                  ? 'text-[#5FAF46] bg-[#5FAF46]/10'
                  : 'text-gray-600 hover:bg-[#5FAF46] hover:text-white'
              } transition-colors`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
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
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex-1 max-w-2xl ml-4 md:ml-0">
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

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 text-gray-600 hover:text-[#5FAF46]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button> */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{userData.name || 'User'}</span>
                  {/* <span className="text-sm text-gray-500">KENYA</span> */}
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