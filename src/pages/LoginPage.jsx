import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Page ko refresh hone se rokne ke liye
    setError('');

    try {
      // FastAPI ko login ke liye JSON nahi, form data chahiye hota hai
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Token (Digital Pass) ko LocalStorage (Browser ki tijori) mein save karo
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        
        // Role padh kar sahi dashboard par bhej do (Traffic Police logic)
        if (data.role === 'superadmin') {
          navigate('/superadmin');
        } else if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/technician');
        }
      } else {
        // Agar password galat hai toh error dikhao
        setError(data.detail || "Login Fail ho gaya!");
      }
    } catch (err) {
      setError("Server se connect nahi ho paya. Backend check karein!");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333' }}>Aapka Sahayak 🔐</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Staff & Admin Login</p>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          required 
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#1565c0', color: 'white', fontSize: '16px', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
          Secure Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;