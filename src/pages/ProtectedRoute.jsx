import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  // 1. Check karo ki kya user ne pehle login kiya tha (LocalStorage mein pass hai?)
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 2. Agar pass (token) nahi hai, toh dhakke maar kar Login page par bhejo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar pass hai, par us "Kamre" (Role) ka nahi hai (e.g. Technician admin room me ghus raha hai)
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" replace />; // Ya fir home page par bhej dein
  }

  // 4. Agar sab theek hai, toh usko andar jaane do (render the component)
  return children;
}

export default ProtectedRoute;