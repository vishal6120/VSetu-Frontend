import { useState, useEffect } from 'react';

function TechnicianDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [bookings, setBookings] = useState([]);
  
  // Har booking ke OTP input ko alag-alag save rakhne ke liye naya variable
  const [enteredOtps, setEnteredOtps] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Checking...");
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        setMessage(""); 
      } else {
        setMessage("Login Failed: Galat username ya password ❌");
      }
    } catch (error) {
      setMessage("Server error! Backend check karein.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setBookings([]);
    setMessage("Logged out successfully.");
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/bookings", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        handleLogout();
        setMessage("Session expired, please login again.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // ---- NAYA FUNCTION: OTP Verify Karke Kaam Complete Karna ----
  const handleCompleteWork = async (bookingId) => {
    const otp = enteredOtps[bookingId]; // User ne jo OTP type kiya hai wo nikalo
    
    if (!otp) {
      alert("Bhai, pehle customer se OTP maang kar daalo!");
      return;
    }

    try {
      // Backend ko PUT request bhej rahe hain OTP ke sath
      const response = await fetch(`https://sahayak-backend-bxl1.onrender.com/api/bookings/${bookingId}/complete?otp=${otp}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Badhai ho! Kaam successfully complete ho gaya! 🎉");
        setEnteredOtps({ ...enteredOtps, [bookingId]: "" }); // Input box khali karo
        fetchBookings(); // List ko turant refresh karo taaki status 'Completed' dikhe
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail} ❌`); // Agar OTP galat hua toh backend wala error dikhao
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error!");
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Aapka Sahayak - Technician Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block' }}>Username: </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '5px' }}/>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block' }}>Password: </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '5px' }}/>
          </div>
          <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Login</button>
        </form>
        <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>🛠️ Technician Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={fetchBookings} style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
          📋 Nayi Bookings Check Karein
        </button>

        <div style={{ marginTop: '20px' }}>
          {/* Sirf wo kaam dikhao jo Assigned hai, ya jispe ladke ne OTP daal diya hai (Completed) */}
{bookings.filter(b => b.status === 'Assigned' || b.status === 'Completed').map((booking) => (
            <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{booking.service_type}</h3>
              <p style={{ margin: '5px 0' }}><strong>Customer:</strong> {booking.customer_name}</p>
              <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {booking.phone_number}</p>
              <p style={{ margin: '5px 0' }}><strong>Address:</strong> {booking.address}</p>
              <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ color: booking.status === 'Pending' ? 'orange' : 'green', fontWeight: 'bold' }}>{booking.status}</span></p>
              
              {/* Sirf testing ke liye hum OTP dikha rahe hain */}
              <p style={{ margin: '5px 0', fontSize: '12px', color: 'gray' }}>Hidden OTP (for testing): {booking.completion_otp}</p>

              {/* NAYA HISSA: Agar status Pending hai, toh OTP form dikhao */}
              {booking.status === 'Assigned' && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px', border: '1px dashed #4caf50' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Kaam poora karne ke liye OTP daalein:</p>
                  <p style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>
  (For Testing - Customer's OTP is: {booking.completion_otp || booking.otp})
</p>
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={enteredOtps[booking.id] || ""}
                    onChange={(e) => setEnteredOtps({ ...enteredOtps, [booking.id]: e.target.value })}
                    style={{ padding: '8px', marginRight: '10px', width: '150px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <button
                    onClick={() => handleCompleteWork(booking.id)}
                    style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Verify & Complete ✅
                  </button>
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && <p style={{ color: '#666' }}>Abhi koi data nahi hai. 'Bookings Check Karein' par click karein.</p>}
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;