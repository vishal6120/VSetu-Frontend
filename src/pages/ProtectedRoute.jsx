import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  // .toLowerCase() ka use karein taaki 'Technician' ho ya 'technician', dono chal jayein
  const userRole = localStorage.getItem('role')?.toLowerCase(); 

  if (!token) return <Navigate to="/login" replace />;

  // Yahan bhi allowedRole ko .toLowerCase() kar dein
  if (allowedRole && userRole !== allowedRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default ProtectedRoute;