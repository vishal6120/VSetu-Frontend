import { useState, useEffect } from 'react';

function TechnicianDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [token, setToken] = useState(localStorage.getItem("tech_token") || "");
  const [bookings, setBookings] = useState([]);
  
  const [enteredOtps, setEnteredOtps] = useState({});
  const [activeTab, setActiveTab] = useState('PENDING');
  const [extraCharges, setExtraCharges] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Checking...");
    
    // Yahan JSON ki jagah URLSearchParams hi rakhein, yeh best hai
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("https://vsetu-backend.onrender.com/api/technician/token", {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json" // Yeh line add karke dekhein
        },
        body: formData.toString(),
      });

     if (response.ok) {
        const data = await response.json();
        localStorage.setItem("tech_token", data.access_token);
        localStorage.setItem("tech_username", username);
        setToken(data.access_token);
        setMessage(""); 
      } else {
        setMessage("Login Failed: Username ya Password galat hai! ❌");
      }
    } catch (error) {
      setMessage("Server connection error!");
    } finally {
      setIsLoading(false); // 👈 NAYI LINE: API call khatam hote hi spinner OFF
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tech_token");
    localStorage.removeItem("tech_username"); // Logout par naam hataya
    setToken("");
    setBookings([]);
    setMessage("Logged out successfully.");
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("https://vsetu-backend.onrender.com/api/technician/my-bookings", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data.reverse() : []);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching my bookings:", error);
    }
  };

  const handleAcceptJob = async (bookingId) => {
    try {
      const response = await fetch(`https://vsetu-backend.onrender.com/api/bookings/${bookingId}/accept`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        alert("✅ Aapne duty accept kar li hai. Ab aap location dekh sakte hain!");
        fetchBookings(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRejectJob = async (bookingId) => {
    const confirmReject = window.confirm("Kya aap sach mein ye kaam reject karna chahte hain? Ye Manager ke paas wapas chala jayega.");
    if (!confirmReject) return;

    try {
      const response = await fetch(`https://vsetu-backend.onrender.com/api/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        alert("❌ Aapne ye kaam reject kar diya hai.");
        fetchBookings(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReschedule = async (bookingId) => {
    const confirmReschedule = window.confirm("Kya aap sach mein ise Reschedule karna chahte hain? (Customer phone nahi utha raha?)");
    if (!confirmReschedule) return;

    try {
      const response = await fetch(`https://vsetu-backend.onrender.com/api/bookings/${bookingId}/reschedule`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Booking reschedule kar di gayi hai. Aap agle kaam par ja sakte hain.");
        fetchBookings(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCompleteWork = async (bookingId) => {
    const otp = enteredOtps[bookingId]; 
    const extraCharge = extraCharges[bookingId] || 0; 

    if (!otp) {
      alert("Bhai, pehle customer se OTP maang kar daalo!");
      return;
    }

    try {
      const response = await fetch(`https://vsetu-backend.onrender.com/api/bookings/${bookingId}/complete?otp=${otp}&extra_charge=${extraCharge}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Badhai ho! Kaam successfully complete ho gaya! 🎉");
        setEnteredOtps({ ...enteredOtps, [bookingId]: "" }); 
        setExtraCharges({ ...extraCharges, [bookingId]: "" });
        fetchBookings(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail} ❌`); 
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error!");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      const interval = setInterval(() => {
        fetchBookings();
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [token]);

  const renderAddressWithMap = (fullAddress) => {
    if (!fullAddress) return <span className="text-gray-500 italic">Address nahi diya gaya</span>;
    
    const parts = fullAddress.split("📍 Live Location: ");
    const physicalAddress = parts[0].trim();
    const mapLink = parts.length > 1 ? parts[1].trim() : (fullAddress.includes("http") ? fullAddress : null);

    return (
      <div className="flex flex-col gap-3 mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
        <p className="flex items-start gap-2 text-gray-800 font-medium">
          <span className="text-gray-400 mt-0.5 text-lg">📍</span>
          <span className="leading-relaxed">{physicalAddress || "Customer ne sirf map location bheji hai"}</span>
        </p>
        {mapLink && (
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-[15px] shadow-md hover:bg-blue-700 active:scale-95 transition-all mt-1"
          >
            🗺️ Get Direction (Open Google Maps)
          </a>
        )}
      </div>
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">👨‍🔧 Technician Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Jaise: raju_bhai"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••"/>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold py-3 rounded-lg shadow-md flex justify-center items-center transition-all ${
                isLoading 
                  ? "bg-green-400 cursor-not-allowed text-white" 
                  : "bg-green-600 hover:bg-green-700 active:scale-95 text-white"
              }`}
            >
              {isLoading ? (
                /* 🔄 Ghoomne wala Spinner */
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                /* Normal Text */
                "Login"
              )}
            </button>
          </form>
          {message && <p className="text-red-500 font-bold text-center mt-4 bg-red-50 p-2 rounded">{message}</p>}
        </div>
      </div>
    );
  }

  // 👇 NAAM AUR KAMAI KA CALCULATION (100% FIXED)
  const loggedInTech = localStorage.getItem("tech_username") || "Sahayak";
  
  // 1. India (Local time) ke hisaab se aaj ki date nikalein
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`; 

  const todaysEarnings = (Array.isArray(bookings) ? bookings : [])
    .filter(b => {
      // 2. Sirf Completed aur Verified bookings hi ginen
      if (b.status !== 'Completed' && b.status !== 'Verified') return false;

      // 3. Date check: Hum pehle updated_at (Kaam khatam hone ka time) check karenge.
      const targetDateString = b.updated_at || b.created_at || "";
      const targetDate = targetDateString.split('T')[0];
      
      return targetDate === todayDate;
    })
    .reduce((sum, b) => {
      // 4. Paisa safely add karein: Agar final_amount null hai, toh base price use karein
      const paisa = Number(b.final_amount) || Number(b.price) || 0;
      return sum + paisa;
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <span>🔧</span> Technician Panel
        </h2>
        <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors">
          Logout
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 mt-2">
        
        {/* 👇 TECHNICIAN PROFILE AUR EARNINGS HEADER */}
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm mb-6 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 border border-blue-200 text-2xl rounded-full flex items-center justify-center shadow-sm">
              🧑‍🔧
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider mb-0.5">Welcome Back</p>
              <p className="font-bold text-gray-900 text-lg capitalize leading-tight">
                Namaste, {loggedInTech}!
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl flex flex-col items-center shadow-inner">
            <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-widest mb-0.5">
              Aaj ki Kamai
            </span>
            <span className="text-xl font-black text-green-800 tracking-tight">
              ₹{todaysEarnings}
            </span>
          </div>
        </div>
        {/* 👆 -------------------------------------- */}

        <button onClick={fetchBookings} className="w-full bg-black text-white py-3.5 rounded-xl font-bold mb-6 shadow-md flex justify-center items-center gap-2 active:scale-95 transition-transform">
          🔄 Naya Kaam Check Karein
        </button>

        <div className="flex space-x-2 border-b border-gray-300 mb-6 mt-4">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === 'PENDING' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Pending Kaam
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === 'COMPLETED' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Poora Hua
          </button>
        </div>

        <div className="space-y-4">
          {(Array.isArray(bookings) ? bookings : []).filter((booking) => {
            if (activeTab === 'PENDING') {
                return ['Assigned', 'Accepted', 'Rescheduled'].includes(booking.status);
            }
            if (activeTab === 'COMPLETED') {
                return ['Completed', 'Verified'].includes(booking.status);
            }
            return false;
          }).map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-gray-900">{booking.service_name || "Service Duty"}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  booking.status === 'Completed' || booking.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400">👤</span> 
                  <span className="font-semibold text-lg">{booking.customer_name}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400">📞</span> 
                  <a href={`tel:${booking.phone_number}`} className="text-blue-600 font-bold underline text-lg">
                    {booking.phone_number}
                  </a>
                </p>
                {booking.status !== 'Assigned' && renderAddressWithMap(booking.address)}
              </div>

              {booking.status === 'Assigned' && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleAcceptJob(booking.id)}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition-all flex justify-center items-center gap-2"
                  >
                    ✅ Accept Duty
                  </button>
                  <button 
                    onClick={() => handleRejectJob(booking.id)}
                    className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-lg hover:bg-red-100 transition-all flex justify-center items-center gap-2"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {booking.status === 'Accepted' && (
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-3 text-center">
                    Kaam Khatam Karne Ke Baad Details Bharein
                  </p>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-orange-700 mb-1">Extra Material Cost (Agar laga ho):</label>
                    <input 
                      type="number" 
                      placeholder="₹0" 
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold"
                      value={extraCharges[booking.id] || ""}
                      onChange={(e) => setExtraCharges({...extraCharges, [booking.id]: e.target.value})}
                    />
                  </div>
                  
                  <p className="text-center text-[10px] text-gray-400 mb-1"></p>
                  
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="number" 
                      placeholder="Customer OTP" 
                      className="flex-1 px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center font-bold tracking-widest text-lg"
                      value={enteredOtps[booking.id] || ""}
                      onChange={(e) => setEnteredOtps({...enteredOtps, [booking.id]: e.target.value})}
                    />
                    <button 
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-sm active:scale-95 transition-transform"
                      onClick={() => handleCompleteWork(booking.id)}
                    >
                      Verify
                    </button>
                  </div>

                  <div className="border-t border-orange-200 pt-3 mt-2 text-center">
                    <button 
                      onClick={() => handleReschedule(booking.id)}
                      className="text-red-600 hover:text-red-800 font-bold text-sm underline underline-offset-2"
                    >
                      Customer Nahi Mila? / Not Answering?
                    </button>
                  </div>

                </div>
              )}

              {(booking.status === 'Completed' || booking.status === 'Verified') && (
                <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3 text-center shadow-sm">
                  <p className="text-sm font-bold text-green-700 flex items-center justify-center gap-1">
                    <span className="text-lg">✅</span> Kaam Poora Ho Gaya
                  </p>
                  <p className="text-xs text-green-800 mt-1 font-medium bg-green-100 inline-block px-3 py-1 rounded-full">
                    Kamai: <span className="font-extrabold">₹{booking.final_amount || 0}</span>
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;