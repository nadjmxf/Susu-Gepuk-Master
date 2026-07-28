import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function RiderPrivateRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      const userRole = authService.getUserRole();

      if (!isAuthenticated || userRole !== 'rider') {
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Verify token is still valid on the server
      const tokenValid = await authService.verifyToken();
      if (!tokenValid) {
        // Token invalid — clear local data
        authService.logout();
        setIsValid(false);
      } else {
        setIsValid(true);
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/rider/login" replace />;
  }

  return children;
}
