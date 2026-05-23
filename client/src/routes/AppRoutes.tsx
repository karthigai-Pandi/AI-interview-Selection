import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import CandidateWorkflow from '../pages/candidate/CandidateWorkflow';
import ResumeUploadPage from '../pages/candidate/ResumeUploadPage';
import AptitudeTestPage from '../pages/candidate/AptitudeTestPage';
import TechnicalTestPage from '../pages/candidate/TechnicalTestPage';
import CodingAssessmentPage from '../pages/candidate/CodingAssessmentPage';
import AIInterviewPage from '../pages/candidate/AIInterviewPage';
import PerformanceAnalysisPage from '../pages/candidate/PerformanceAnalysisPage';
import CandidateDashboard from '../pages/CandidateDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/candidate"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/flow/*"
        element={
          <ProtectedRoute role="candidate">
            <CandidateWorkflow />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate replace to="resume" />} />
        <Route path="resume" element={<ResumeUploadPage />} />
        <Route path="aptitude" element={<AptitudeTestPage />} />
        <Route path="technical" element={<TechnicalTestPage />} />
        <Route path="coding" element={<CodingAssessmentPage />} />
        <Route path="interview" element={<AIInterviewPage />} />
        <Route path="performance" element={<PerformanceAnalysisPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
