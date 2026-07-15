import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { Suspense } from 'react';
import PrivateRoute from './components/PrivateRoute';
import RiderPrivateRoute from './components/RiderPrivateRoute';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const RiderLogin = lazy(() => import('./pages/RiderLogin'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const OutletLocation = lazy(() => import('./pages/OutletLocation'));
const SotrLocation = lazy(() => import('./pages/SotrLocation'));
const RiderLayout = lazy(() => import('./layouts/RiderLayout'));
const RiderDashboard = lazy(() => import('./pages/rider/Dashboard'));
const RekapPenjualan = lazy(() => import('./pages/rider/RekapPenjualan'));
const RiwayatPenjualan = lazy(() => import('./pages/rider/RiwayatPenjualan'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminRiders = lazy(() => import('./pages/admin/Riders'));
const AdminOutlets = lazy(() => import('./pages/admin/Outlets'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="inline-block animate-spin">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/outlets" element={<OutletLocation />} />
          <Route path="/sotr" element={<SotrLocation />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/forgot" element={<ForgotPassword />} />

          {/* Rider Routes */}
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route path="/rider" element={
            <RiderPrivateRoute>
              <RiderLayout />
            </RiderPrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RiderDashboard />} />
            <Route path="Rekap" element={<RekapPenjualan />} />
            <Route path="riwayat" element={<RiwayatPenjualan />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="riders" element={<AdminRiders />} />
            <Route path="outlets" element={<AdminOutlets />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
