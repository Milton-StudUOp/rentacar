import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import PasswordReset from './pages/PasswordReset';
import About from './pages/About';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVehicles from './pages/admin/Vehicles';
import AdminBookings from './pages/admin/Bookings';
import AdminClients from './pages/admin/Clients';
import AdminSettings from './pages/admin/Settings';
import AdminCorporateRequests from './pages/admin/CorporateRequests';

import { ThemeProvider } from './components/ThemeProvider';


export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout/:type/:id" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="corporate" element={<AdminCorporateRequests />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<div className="p-20 text-center">404 - Not Found (Current path: {window.location.pathname})</div>} />
      </Routes>
    </ThemeProvider>
  );
}
