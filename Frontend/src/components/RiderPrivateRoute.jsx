import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function RiderPrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated || userRole !== 'rider') {
    return <Navigate to="/rider/login" replace />;
  }

  return children;
}
