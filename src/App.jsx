import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyBookings from './pages/MyBookings'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import ProtectedRoute from './ProtectedRoute';
import Footer from './components/Footer'; 

// 👇 NAYA: Yeh function app khulte hi check karega ki memory mein kaun hai 👇
const SmartHomeRoute = () => {
  const role = localStorage.getItem('role');
  
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'technician') return <Navigate to="/technician" replace />;
  if (role === 'superadmin') return <Navigate to="/superadmin" replace />;
  
  // Agar role 'customer' hai ya koi login nahi hai, toh Customer Dashboard dikhao
  return <BookingPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Yahan normal BookingPage ki jagah SmartHomeRoute laga diya 👇 */}
        <Route path="/" element={<SmartHomeRoute />} />
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/my-bookings" 
          element={<ProtectedRoute allowedRole="customer"><MyBookings /></ProtectedRoute>} 
        />
        
        <Route 
          path="/admin" 
          element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        
        {/* TECHNICIAN KA SAHI RASTA */}
        <Route path="/technician" element={<TechnicianDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;