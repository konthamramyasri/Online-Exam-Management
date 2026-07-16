import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/AuthPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminExams } from './pages/admin/AdminExams';
import { AdminQuestions } from './pages/admin/AdminQuestions';
import { AdminExamDetail } from './pages/admin/AdminExamDetail';
import { AdminGradebook } from './pages/admin/AdminGradebook';
import { StudentLayout } from './pages/student/StudentLayout';
import { StudentOverview } from './pages/student/StudentOverview';
import { StudentExams } from './pages/student/StudentExams';
import { StudentExamEngine } from './pages/student/StudentExamEngine';
import { StudentResults } from './pages/student/StudentResults';

function LoginRoute() {
  const [params] = useSearchParams();
  const role = params.get('role') || 'student';
  return <AuthPage mode="login" role={role === 'admin' ? 'admin' : 'student'} />;
}

function RegisterRoute() {
  const [params] = useSearchParams();
  const role = params.get('role') || 'student';
  return <AuthPage mode="register" role={role === 'admin' ? 'admin' : 'student'} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="exams/:examId" element={<AdminExamDetail />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="gradebook" element={<AdminGradebook />} />
          </Route>

          {/* Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentOverview />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="exams/:examId" element={<StudentExamEngine />} />
            <Route path="results" element={<StudentResults />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
