import { useState, useEffect } from 'react';

function SuperAdminDashboard() {
  const [stats, setStats] = useState({ total_revenue: 0, total_commission: 0, total_jobs: 0 });

 useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Apni tijori (LocalStorage) se Token nikalo
        const token = localStorage.getItem("token");

        // 2. Fetch request mein us token ko as a 'Bearer' (Pass) bhej do
        const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/superadmin/stats", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Yahan hum Bouncer ko Pass dikha rahe hain
            "Content-Type": "application/json"
          }
        });

        // 3. Agar Bouncer ne entry de di (Response OK) toh data dikhao
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("⛔ Bouncer ne entry nahi di! Token galat ya expire ho gaya.");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>🚀 Super Admin (Founder) Dashboard</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Aapka Sahayak - Real-time Business Analytics</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
        
        {/* Revenue Card */}
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', width: '30%', textAlign: 'center', border: '1px solid #90caf9', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#1565c0' }}>Total Revenue</h3>
          <h1 style={{ margin: '15px 0', color: '#0d47a1' }}>₹{stats.total_revenue}</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Market se collect hua paisa</p>
        </div>

        {/* Commission Card (Aapka Profit) */}
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', width: '30%', textAlign: 'center', border: '1px solid #a5d6a7', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#2e7d32' }}>Aapka Profit (5%)</h3>
          <h1 style={{ margin: '15px 0', color: '#1b5e20' }}>₹{stats.total_commission}</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Aapki net kamai</p>
        </div>

        {/* Jobs Card */}
        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', width: '30%', textAlign: 'center', border: '1px solid #ffcc80', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#e65100' }}>Verified Jobs</h3>
          <h1 style={{ margin: '15px 0', color: '#bf360c' }}>{stats.total_jobs}</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Complete hui deals</p>
        </div>

      </div>
    </div>
  );
}

export default SuperAdminDashboard;