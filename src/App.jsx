import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyBookings from './pages/MyBookings'; 
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import ProtectedRoute from './ProtectedRoute';
import Footer from './components/Footer'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
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
        
        {/* 👇 TECHNICIAN KA SAHI RASTA 👇 */}
        <Route 
          path="/technician-dashboard" 
          element={
            <ProtectedRoute allowedRole="technician">
              <Technician />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;