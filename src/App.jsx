import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Surveys from './components/Surveys';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Questionnaire from './components/Questionnaire';
import MyQuestionnaires from './components/MyQuestionnaires';
import Faqs from './components/Faqs';
import ContactUs from './components/ContactUs';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
          <Route path="/my-questionnaires" element={<MyQuestionnaires />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;