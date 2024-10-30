import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { CustomThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import LoadingSpinner from './components/LoadingSpinner';

const Expenses = lazy(() => import('./pages/Expenses'));
const Profile = lazy(() => import('./pages/Profile'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignUp = lazy(() => import('./pages/SignUp'));

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;
