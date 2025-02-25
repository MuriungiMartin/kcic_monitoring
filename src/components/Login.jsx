import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const loginUrl = `${baseUrl}/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions`;
      
      const soapRequest = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
          <FnloginCustomer xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
            <email>${credentials.email}</email>
            <password>${credentials.password}</password>
          </FnloginCustomer>
        </Body>
      </Envelope>`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', loginUrl, true);
      
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader('SOAPAction', 'fnloginCustomer');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log(xhr.responseText);
          console.log(xhr.status);
          if (xhr.status === 200) {
            try {
              const soapResponse = xhr.responseText;
              const jsonStartIndex = soapResponse.indexOf('{"');
              const jsonEndIndex = soapResponse.lastIndexOf('}') + 1;
              const jsonString = soapResponse.substring(jsonStartIndex, jsonEndIndex);
              
              const responseData = JSON.parse(jsonString);
              console.log(responseData);
              
              if (responseData.success) {
                sessionStorage.setItem('userData', JSON.stringify({
                  name: responseData.Name,
                  image: responseData.image,
                  email: responseData.email
                }));
                sessionStorage.setItem('isAuthenticated', 'true');

    
                navigate('/dashboard');
              } else {
                setError('Invalid credentials');
              }
            } catch (err) {
              console.error('Error parsing response:', err);
              if (err.message.includes('Invalid')) {
                setError('Invalid Email or Password');
              } else {
                setError('An error occurred during login');
              }
            }
          } else {
            setError('Login failed');
          }
        }
      };
      
      xhr.onerror = () => {
        setError('Network error occurred');
        console.error('XHR Error:', xhr.statusText);
      };

      xhr.send(soapRequest);

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }
    
    await handleLogin();
  };  

  const handleResetDataChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateOtp = async () => {
    if (!resetData.email) {
      setError('Please enter your email');
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      console.log(resetData.email);
      const soapRequest = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
            <GenerateOtpCode xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
                <email>${resetData.email}</email>
            </GenerateOtpCode>
        </Body>
      </Envelope>`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions`, true);
      
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader('SOAPAction', 'GenerateOtpCode');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));
      
      xhr.onreadystatechange = function() {
        console.log(xhr.readyState);
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          if (xhr.status === 200) {
            const response = xhr.responseText;
            console.log(response);
            if (response.includes('Success')) {
              setOtpSent(true);
              setError('');
              navigate('/reset-password', { state: { email: resetData.email } });
            } else {
              setError('Failed to send OTP. Please try again.');
            }
          } else {
            setError('Failed to send OTP. Please try again.');
          }
        }
      };
      
      xhr.send(soapRequest);
    } catch (err) {
      setError('An error occurred while sending OTP');
      console.error('Error:', err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetData.otp || !resetData.newPassword || !resetData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const soapRequest = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
          <ResetCustomerPassword xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
            <Email>${resetData.email}</Email>
            <NewPassword>${resetData.newPassword}</NewPassword>
            <Otp>${resetData.otp}</Otp>
          </ResetCustomerPassword>
        </Body>
      </Envelope>`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions`, true);
      
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader('SOAPAction', 'ResetCustomerPassword');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('Appkings:Appkings@254!'));
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 && xhr.responseText.includes('true')) {
            setError('');
            setResetMode(false);
            setOtpSent(false);
            alert('Password reset successful. Please login with your new password.');
          } else {
            setError('Failed to reset password. Please try again.');
          }
        }
      };
      
      xhr.send(soapRequest);
    } catch (err) {
      setError('An error occurred while resetting password');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <img
            className="mx-auto h-20 w-auto mb-4"
            src="https://www.kenyacic.org/wp-content/uploads/2024/01/KCIC-logo.png"
            alt="KCIC Logo"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Sign in to KCIC Monitoring System
          </p>
        </div>
        <form className="space-y-6" onSubmit={resetMode ? handleResetPassword : handleSubmit}>
          {!resetMode ? (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-[#5FAF46] hover:text-[#4a8c38] focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                      value={resetData.email}
                      onChange={handleResetDataChange}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5FAF46] hover:bg-[#5FAF46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5FAF46]"
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                      value={resetData.otp}
                      onChange={handleResetDataChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                      value={resetData.newPassword}
                      onChange={handleResetDataChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2e7d32] focus:border-[#2e7d32] sm:text-sm"
                      value={resetData.confirmPassword}
                      onChange={handleResetDataChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5FAF46] hover:bg-[#5FAF46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5FAF46]"
                  >
                    Reset Password
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setResetMode(false);
                  setOtpSent(false);
                  setError('');
                }}
                className="w-full text-sm text-[#5FAF46] hover:text-[#4a8c38] focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          )}
          {/* Only show Sign in button when not in reset mode */}
          {!resetMode && (
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5FAF46] hover:bg-[#5FAF46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5FAF46] transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;