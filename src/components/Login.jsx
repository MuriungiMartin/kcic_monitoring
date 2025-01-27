import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
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
      const loginUrl = "http://45.149.206.133:6047/KCICCTEST/WS/CRONUS%20International%20Ltd./Codeunit/ProjectQuestions";
      
      const soapRequest = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
          <fnloginCustomer xmlns="urn:microsoft-dynamics-schemas/codeunit/ProjectQuestions">
            <email>${credentials.email}</email>
            <pasword>${credentials.password}</pasword>
          </fnloginCustomer>
        </Body>
      </Envelope>`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', loginUrl, true);
      
      // Add headers
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader('SOAPAction', 'fnloginCustomer');
      
      // Add Basic Authentication
      const username = 'Appkings';
      const password = 'Appkings@254!';
      const auth = 'Basic ' + btoa(username + ':' + password);
      xhr.setRequestHeader('Authorization', auth);
      
      // Update the xhr.onreadystatechange handler:
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          // Extract the JSON string from SOAP response
          const soapResponse = xhr.responseText;
          const jsonStartIndex = soapResponse.indexOf('{"');
          const jsonEndIndex = soapResponse.lastIndexOf('}') + 1;
          const jsonString = soapResponse.substring(jsonStartIndex, jsonEndIndex);
          
          // Parse the extracted JSON
          const responseData = JSON.parse(jsonString);
          console.log(responseData);
          
          if (responseData.success) {
            // Store user data in sessionStorage
            sessionStorage.setItem('userData', JSON.stringify({
              name: responseData.Name,
              image: responseData.image
            }));
            sessionStorage.setItem('isAuthenticated', 'true');
  
            // Navigate to dashboard on successful login
            navigate('/dashboard');
          } else {
            setError('Invalid credentials');
          }
        } catch (err) {
          console.error('Error parsing response:', err);
          setError('An error occurred during login');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;