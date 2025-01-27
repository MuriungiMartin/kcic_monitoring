import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Surveys from './components/Surveys';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Questionnaire from './components/Questionnaire';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/questionnaire/:surveyCode" element={<Questionnaire />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;