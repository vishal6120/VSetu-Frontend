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
      {/* MALIK NOTE: Humne wo purana kaala Navbar yahan se HATA DIYA hai! 
        Ab customer ko sirf sidha VSetu jaisa Booking Page dikhega.
      */}

      <Routes>
        {/* 1. PUBLIC ROUTES (Sabke liye khule hain - Window Shopping) */}
        <Route path="/" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 2. SECURE ROUTES (Guard ke peechhe) */}
        
        {/* Customer ki Personal Bookings */}
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute allowedRole="customer">
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin/Manager ka Rasta */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* 3. TECHNICIAN KA RASTA (Isme Login bhi hai, isliye Guard bahar se hata diya) */}
        <Route 
          path="/technician" 
          element={<TechnicianDashboard />} 
        />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;