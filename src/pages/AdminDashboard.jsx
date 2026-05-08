import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedTechs, setSelectedTechs] = useState({});
  const [amounts, setAmounts] = useState({});

  // Backend se saari bookings mangwana
  const fetchBookings = async () => {
    try {
      const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/bookings");
      const data = await response.json();
      // Sabse nayi booking upar dikhane ke liye reverse kar rahe hain
      setBookings(data.reverse());
    } catch (error) {
      console.error("Error:", error);
      setMessage("Backend se connect nahi ho pa raha hai.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Ladke ko assign karne wala function
  const handleAssign = async (bookingId) => {
    const techName = selectedTechs[bookingId];
    if (!techName) {
      alert("Pehle kisi ladke ka naam select karein!");
      return;
    }

    try {
      const response = await fetch(`https://sahayak-backend-bxl1.onrender.com/api/bookings/${bookingId}/assign?technician_name=${techName}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage(`✅ Kaam ${techName} ko de diya gaya hai.`);
        fetchBookings(); // List ko refresh karo
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Paise verify karne wala function
  const handleVerify = async (bookingId) => {
    const finalAmount = amounts[bookingId];
    if (!finalAmount) {
      alert("Pehle customer se verify kiya hua amount daalein!");
      return;
    }

    try {
      const response = await fetch(`https://sahayak-backend-bxl1.onrender.com/api/bookings/${bookingId}/verify?amount=${finalAmount}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage(`✅ Paise verify ho gaye: ₹${finalAmount}`);
        fetchBookings(); // List ko refresh karo
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>👑 Manager Control Room</h2>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={fetchBookings} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          🔄 Nayi Bookings Check Karein
        </button>
      </div>

      {message && <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>{message}</p>}

      {bookings.map((booking) => (
        <div key={booking.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
          <h3>{booking.service_type}</h3>
          <p><strong>Customer:</strong> {booking.customer_name} | <strong>Phone:</strong> {booking.phone_number}</p>
          <p><strong>Address:</strong> {booking.address}</p>
          <p><strong>Status:</strong> <span style={{ color: booking.status === 'Pending' ? 'orange' : booking.status === 'Assigned' ? 'blue' : 'green', fontWeight: 'bold' }}>{booking.status}</span></p>

          <hr style={{ border: '0.5px solid #ddd' }} />

          {/* MANAGER ACTIONS */}
          <div style={{ marginTop: '10px' }}>
            
            {/* 1. Agar Pending hai, toh Assign karne ka option dikhao */}
            {booking.status === 'Pending' && (
              <div>
                <label style={{ fontWeight: 'bold' }}>👉 Ladka Bhejein: </label>
                <select 
                  onChange={(e) => setSelectedTechs({...selectedTechs, [booking.id]: e.target.value})}
                  style={{ padding: '5px', marginRight: '10px', borderRadius: '4px' }}
                >
                  <option value="">-- Select --</option>
                  <option value="Raju">Raju</option>
                  <option value="Sonu">Sonu</option>
                  <option value="Amit">Amit</option>
                </select>
                <button onClick={() => handleAssign(booking.id)} style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Assign</button>
              </div>
            )}

            {/* 2. Agar Assign ho gaya hai */}
            {booking.status === 'Assigned' && (
              <p style={{ color: '#555' }}>🛠️ <strong>{booking.assigned_technician}</strong> kaam karne gaya hai. Wait karein...</p>
            )}

            {/* 3. Agar Technician ne kaam khatam kar diya hai (Lekin verify nahi hua) */}
            {/* Note: Abhi humare system mein hum "Pending" ya "Assigned" ke baad verify option de rahe hain testing ke liye */}
            {booking.status === 'Completed' && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#2e7d32' }}>📞 Call Karke Paise Verify Karein: </label>
                <br/>
                <input 
                  type="number" 
                  placeholder="₹ Kitne mile?" 
                  onChange={(e) => setAmounts({...amounts, [booking.id]: e.target.value})}
                  style={{ padding: '5px', marginTop: '5px', marginRight: '10px', width: '120px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <button onClick={() => handleVerify(booking.id)} style={{ padding: '5px 10px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verify ✔️</button>
              </div>
            )}

            {/* 4. Agar Verify ho gaya hai */}
            {booking.status === 'Verified' && (
              <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Deal Done! Verified Amount: ₹{booking.final_amount} (Assigned to: {booking.assigned_technician})</p>
            )}

          </div>
        </div>
      ))}

      {bookings.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>Abhi koi data nahi hai.</p>}
    </div>
  );
}

export default AdminDashboard;