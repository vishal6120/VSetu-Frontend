import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  // Browser ki tijori (localStorage) se Pass aur Role nikalo
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Rule 1: Agar Pass (Token) hi nahi hai, toh Login par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Rule 2: Agar Pass hai, lekin uski Post (Role) galat hai 
  // (Jaise Raju Technician, SuperAdmin kholne ki koshish kare)
  if (allowedRole && userRole !== allowedRole) {
    alert("⛔ Rasta Bhatak Gaye! Danger zone.");
    return <Navigate to="/login" replace />;
  }

  // Agar dono cheezein sahi hain, toh andar aane do (page dikhao)
  return children;
}

export default ProtectedRoute;