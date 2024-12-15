import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path="/admin" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard/>
              </ProtectedRoute>
              } />
            <Route path="/doctor" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DoctorDashboard/>
            </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
