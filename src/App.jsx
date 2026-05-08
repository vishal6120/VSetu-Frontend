import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TechnicianDashboard from './pages/TechnicianDashboard';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';


function App() {
  return (
  <BrowserRouter>
    <nav style={{ padding: '15px', backgroundColor: '#333', color: 'white' }}>
      {/* Aapke purane Navbar links yahan hain */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>🏠 Customer Home</Link>
      <Link to="/technician" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>🛠️ Technician Login</Link>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>👑 Manager Dashboard</Link>
      <Link to="/superadmin" style={{ color: '#ffeb3b', textDecoration: 'none', fontWeight: 'bold' }}>🚀 Super Admin</Link>
      <Link to="/login" style={{ color: '#00e676', textDecoration: 'none', fontSize: '18px', marginLeft: '20px', fontWeight: 'bold' }}>🔐 Staff Login</Link>
    </nav>

    {/* 👇 YEH HAI WOH MAIN DABBA (Routes) 👇 */}
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<BookingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Secure Pages (Bouncer ke peeche) */}
      <Route path="/technician" element={
        <ProtectedRoute allowedRole="technician">
          <TechnicianDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/superadmin" element={
        <ProtectedRoute allowedRole="superadmin">
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />

      {/* 404 Error Page */}
      <Route path="*" element={
        <div style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>
          <h3>404 - Rasta Bhatak Gaye! 🛑</h3>
          <p>Yeh page exist nahi karta. Kripya upar diye gaye links ka use karein. 👑</p>
        </div>
      } />
    </Routes>
    {/* 👆 DABBA BAND 👆 */}

  </BrowserRouter>
);
}

export default App;