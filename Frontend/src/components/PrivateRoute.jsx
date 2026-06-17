import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated || userRole !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
