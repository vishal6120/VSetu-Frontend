import { useState } from 'react';

function BookingPage() {
  // Form ke inputs ko save karne ke liye 'states'
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("House Cleaning");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // Jab user "Book Now" dabayega toh yeh function chalega
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Booking save ho rahi hai... ⏳");

    // Backend ko bhejne ke liye data ka packet banaya
    const bookingData = {
      customer_name: name,
      phone_number: phone,
      service_type: serviceType,
      address: address
    };

    try {
      // Backend ke POST wale route par data bhej rahe hain
      const response = await fetch("https://sahayak-backend-bxl1.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setMessage("✅ Badhai ho! Aapki booking successfully ho gayi hai. Technician jaldi hi aayega.");
        // Booking hone ke baad form ko wapas khali kar do
        setName(""); setPhone(""); setAddress(""); setServiceType("AC Repair");
      } else {
        setMessage("❌ Kuch gadbad hai. Kripya details check karein.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error! Backend chalu hai ya nahi check karein.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Service Book Karein 🛠️</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Aapka Naam:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Konsi Chahiye?:</label>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
        {/* Chalu Services */}
        <option value="House Cleaning">House Cleaning (Deep Clean)</option>
        <option value="Water Tank Cleaning">Water Tank Cleaning</option>
        <option value="Sofa/Carpet Cleaning">Sofa & Carpet Cleaning</option>

        {/* Band Services (Customer ko dikhega par click nahi hoga) */}
        <option value="AC Repair" disabled>AC Repair (Coming Soon 🚀)</option>
        <option value="Electrical Repair" disabled>Electrical Repair (Coming Soon 🚀)</option>
        <option value="Plumbing" disabled>Plumbing (Coming Soon 🚀)</option>
      </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pura Address (Lucknow):</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows="3" style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          Book Now
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold', color: message.includes('❌') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BookingPage;