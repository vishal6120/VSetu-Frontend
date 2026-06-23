import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  // NAYA: Ye dono lines function ke ANDAR aayengi
  const [editingTechBookingId, setEditingTechBookingId] = useState(null); 
  const [newTechnicianName, setNewTechnicianName] = useState("");
  
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  
  const [selectedTechs, setSelectedTechs] = useState({});
  const [techPhones, setTechPhones] = useState({}); // <--- NAYA: Phone number save karne ke liye
  const [amounts, setAmounts] = useState({});
  
  // TAB CONTROL KE LIYE NAYA STATE
  const [activeTab, setActiveTab] = useState('PENDING');
  
  // STAFF MANAGEMENT KE LIYE STATES
  const [staffList, setStaffList] = useState([]);
  const [newTechUsername, setNewTechUsername] = useState("");
  const [newTechPassword, setNewTechPassword] = useState("");
  const [newTechTrade, setNewTechTrade] = useState("");
  const [newTechPhone, setNewTechPhone] = useState("");
  const [showAddTechModal, setShowAddTechModal] = useState(false); // Popup kholne/band karne ke liye
  const [searchTech, setSearchTech] = useState(""); // Search box ke text ke liye

  // Ladkon ki list backend se mangwane ka function (AB ANDAR HAI)
  const fetchStaff = async () => {
    try {
      // YAHAN URL THEEK KIYA HAI
      const response = await fetch("http://localhost:8000/api/technicians");
      if(response.ok){
        const data = await response.json();
        setStaffList(data);
      }
    } catch (error) {
      console.error("Staff fetch error:", error);
    }
  };

  // Naya ladka add karne ka function (AB ANDAR HAI)
  const handleCreateStaff = async () => {
    if(!newTechUsername || !newTechPassword){
      alert("Username aur Password dono daalna zaroori hai!");
      return;
    }
    const formData = new URLSearchParams();
    formData.append("username", newTechUsername);
    formData.append("password", newTechPassword);
    formData.append("trade", newTechTrade);
    formData.append("phone", newTechPhone);

    try {
      // YAHAN URL THEEK KIYA HAI
      const response = await fetch("http://localhost:8000/api/technicians/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      
      if(response.ok) {
        alert("Naya ladka successfully add ho gaya! 🎉");
        setNewTechUsername(""); 
        setNewTechPassword("");
        fetchStaff(); 
        setShowAddTechModal(false);
      } else {
        alert("Error: Shayad ye Username pehle se maujood hai.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  // NAYA FUNCTION: Technician ko delete karne ke liye
  const handleDeleteStaff = async (id) => {
    // Delete karne se pehle ek baar Manager se confirm karenge
    const confirmDelete = window.confirm("Kya aap sach mein is technician ko hatana chahte hain?");
    if (!confirmDelete) return; // Agar 'Cancel' dabaya toh ruk jao

    try {
      const response = await fetch(`http://localhost:8000/api/technicians/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Technician successfully delete ho gaya! 🗑️");
        fetchStaff(); // List ko turant refresh karne ke liye
      } else {
        alert("Delete karne mein error aaya ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Backend check karein.");
    }
  };

  // Backend se saari bookings mangwana
  const fetchBookings = async () => {
    try {
      // YAHAN URL THEEK KIYA HAI
      const response = await fetch("http://localhost:8000/api/bookings");
      const data = await response.json();
      
      // YAHAN REVERSE WALA ERROR THEEK KIYA HAI
      if (Array.isArray(data)) {
        setBookings(data.reverse());
      } else {
        setBookings([]); // Agar error aaye toh list khali rakho
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Backend se connect nahi ho pa raha hai.");
    }
  };

  // Auto-Refresh logic
  useEffect(() => {
    fetchBookings();
    fetchStaff(); 

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000); 

    
    return () => clearInterval(interval);
  }, []);

 // Ladke ko assign karne wala function
  // Ladke ko assign karne wala function
  const handleAssign = async (bookingId) => {
    const techName = selectedTechs[bookingId];
    
    if (!techName) {
      alert("Pehle kisi ladke ka naam select karein!");
      return;
    }

    // NAYA SMART LOGIC: Dropdown mein jo ladka select kiya hai, list se uska number nikal lo
    const selectedTechObj = staffList.find(staff => staff.username === techName);
    const techPhone = selectedTechObj ? selectedTechObj.phone : "9876543210";

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/assign?technician_name=${techName}&technician_phone=${techPhone}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage(`✅ Kaam ${techName} ko de diya gaya hai.`);
        fetchBookings(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  // 👇👇 NAYA FUNCTION YAHAN PASTE KAREIN 👇👇
  const handleReassignTechnician = async (bookingId) => {
    if (!newTechnicianName) {
      alert("Pehle naye technician ka naam select karein!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/assign?technician_name=${newTechnicianName}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert("✅ Technician successfully change ho gaya!");
        setEditingTechBookingId(null); 
        setNewTechnicianName(""); 
        fetchBookings(); 
      } else {
        alert("❌ Change karne mein problem aayi.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // 👆👆 NAYA FUNCTION YAHAN KHATAM 👆👆


  // Paise verify karne wala function
  const handleVerify = async (bookingId) => {
    const finalAmount = amounts[bookingId];
    if (!finalAmount) {
      alert("Pehle customer se verify kiya hua amount daalein!");
      return;
    }

    try {
      // YAHAN URL THEEK KIYA HAI
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/verify?amount=${finalAmount}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage(`✅ Paise verify ho gaye: ₹${finalAmount}`);
        fetchBookings(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderAddressWithMap = (fullAddress) => {
    if (!fullAddress) return <span className="text-gray-500 italic">Address nahi diya gaya</span>;
    
    const parts = fullAddress.split("📍 Live Location: ");
    const physicalAddress = parts[0].trim();
    const mapLink = parts.length > 1 ? parts[1].trim() : null;

    return (
      <div className="mt-1 flex flex-col items-start gap-3">
        <span className="text-gray-700 font-medium leading-relaxed">
          {physicalAddress || "Customer ne sirf map location bheji hai."}
        </span>
        
        {mapLink && (
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 border border-blue-300 transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            🗺️ Get Direction
          </a>
        )}
      </div>
    );
  };


  const todayTotal = bookings.length;
  const pendingTotal = bookings.filter(b => b.status === 'Pending').length;
  const completedTotal = bookings.filter(b => b.status === 'Completed' || b.status === 'Verified').length;

  // ---> YAHAN PAR CUT KIYA HUA CODE PASTE KAREIN <---
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysBookingsCount = bookings.filter(booking => {
    const bookingDate = booking.created_at ? booking.created_at.split('T')[0] : ""; 
    return bookingDate === todayDate;
  }).length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const assignedCount = bookings.filter(b => b.status === 'Assigned').length;
  const completedCount = bookings.filter(b => b.status === 'Completed' || b.status === 'Verified').length;
  const staffCount = staffList.length;
  // --------------------------------------------------

  // 👇👇 NAYA: KAMAI CALCULATION 👇👇
  // Total Kamai: Sabhi Verified/Completed bookings ka paisa
  const totalKamai = bookings
    .filter(b => b.status === 'Completed' || b.status === 'Verified')
    .reduce((sum, b) => sum + (Number(b.final_amount) || Number(b.price) || 0), 0);

  // Aaj Ki Kamai: Jo aaj aaye aur jinka status Verified/Completed hai
  const aajKiKamai = bookings
    .filter(b => {
      const bDate = b.created_at ? b.created_at.split('T')[0] : "";
      return (b.status === 'Completed' || b.status === 'Verified') && bDate === todayDate;
    })
    .reduce((sum, b) => sum + (Number(b.final_amount) || Number(b.price) || 0), 0);
  // 👆👆 NAYA KHATAM 👆👆


  // 👇👇 LOGOUT FUNCTION YAHAN DALEIN 👇👇
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  // 👆👆 ----------------------- 👆👆




  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-4xl">👑</span> Manager Control Room
            </h2>
            <p className="text-gray-500 mt-1">Live bookings aur ladkon ka status yahan check karein.</p>
          </div>
          {/* 👇 NAYA: Dono buttons ko ek sath dikhane ke liye div 👇 */}
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchBookings} 
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
            >
              🔄 Nayi Bookings 
            </button>
            
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
          {/* 👆 NAYA KHATAM 👆 */}
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl font-bold text-center bg-green-50 text-green-700 border border-green-200 shadow-sm transition-all">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Aaj Ki Bookings</p>
            <p className="text-3xl font-bold">{todaysBookingsCount}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
            <p className="text-orange-700 text-xs font-bold uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-extrabold text-orange-700 mt-1">{pendingTotal}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
            <p className="text-green-700 text-xs font-bold uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-extrabold text-green-700 mt-1">{completedTotal}</p>
          </div>
        </div>

        {/* 👇👇 NAYA: Kamai Wale 2 Dabbe 👇👇 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-center">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Aaj Ki Kamai</p>
            <p className="text-3xl font-extrabold text-blue-700 mt-1">₹{aajKiKamai}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-center">
            <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Total Kamai</p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">₹{totalKamai}</p>
          </div>
        </div>
        {/* 👆👆 NAYA KHATAM 👆👆 */}


{/* NAYA: overflow-x-auto aur whitespace-nowrap lagaya taaki mobile par swipe ho sake */}
        <div className="flex overflow-x-auto space-x-2 border-b border-gray-300 mb-6 pb-1 scrollbar-hide whitespace-nowrap">
          {['PENDING', 'ASSIGNED', 'COMPLETED', 'STAFF'].map((tab) => {
            
            // Har tab ke hisaab se uski ginti (count) set kar rahe hain
            let count = 0;
            if (tab === 'PENDING') count = pendingCount;
            if (tab === 'ASSIGNED') count = assignedCount;
            if (tab === 'COMPLETED') count = completedCount;
            if (tab === 'STAFF') count = staffCount;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                // NAYA: 'flex items-center gap-2' add kiya taaki naam aur number ek line mein aayein
                className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
                {/* NAYA: Number dikhane wala Badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === tab ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {bookings.filter((booking) => 
            booking.status.toUpperCase() === activeTab || 
            (activeTab === 'COMPLETED' && booking.status === 'Verified')
          ).map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{booking.service_name}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-mono">Booking ID: #{booking.id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                  booking.status === 'Pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                  booking.status === 'Assigned' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                  booking.status === 'Completed' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                  'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-b border-gray-100 pb-6">
                
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Customer Details</p>
                  <p className="font-semibold text-gray-900 text-lg flex items-center gap-2"><span>👤</span> {booking.customer_name}</p>
                  <p className="text-gray-600 flex items-center gap-2 mt-2"><span>📞</span> {booking.phone_number}</p>
                </div>
<div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-3">Service Details</p>
                  <p className="font-semibold text-blue-900 text-lg flex items-start gap-2">
                    <span>🔧</span> 
                    {booking.service_name || "Service Not Specified"}
                  </p>

                  {/* NAYA: Date aur Time Dikhane ka Badge */}
                  {(booking.booking_date || booking.booking_time) && (
                    <div className="mt-4 bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                      <p className="text-blue-900 text-sm font-bold flex items-center gap-2 mb-1.5">
                        <span className="text-lg">📅</span> 
                        {/* Date ko Indian format (DD/MM/YYYY) mein dikhane ke liye */}
                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-IN') : "Date select nahi ki"}
                      </p>
                      <p className="text-orange-600 text-sm font-bold flex items-center gap-2">
                        <span className="text-lg">⏰</span> 
                        {booking.booking_time || "Time select nahi kiya"}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <p className="text-blue-700 text-sm font-bold bg-blue-100 px-3 py-1 rounded-md">
                      Price: ₹{booking.price || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Service Address</p>
                  {renderAddressWithMap(booking.address)}
                </div>
              </div>

              <div className="pt-2">
               {booking.status === 'Pending' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select 
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedTechs[booking.id] || ""}
                      onChange={(e) => setSelectedTechs({...selectedTechs, [booking.id]: e.target.value})}
                    >
                      <option value="">-- Ladka Select Karein --</option>
                      {staffList.map(staff => (
                        <option key={staff.id} value={staff.username}>{staff.username} ({staff.trade || "Worker"})</option>
                      ))}
                    </select>

                    {/* NAYA: Ladke ka mobile number daalne ka dabba */}
                    <input 
                      type="number" 
                      placeholder="Ladke ka 10-digit No." 
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                      value={techPhones[booking.id] || ""}
                      onChange={(e) => setTechPhones({...techPhones, [booking.id]: e.target.value})}
                    />

                    <button 
                      onClick={() => handleAssign(booking.id)}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                      Kaam Par Bhejein
                    </button>
                  </div>
                )}

                {booking.status === 'Completed' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="number" 
                      placeholder="Kitne paise mile (₹)?" 
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={amounts[booking.id] || ""}
                      onChange={(e) => setAmounts({...amounts, [booking.id]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleVerify(booking.id)}
                      className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                    >
                      Verify Payment
                    </button>
                  </div>
                )}

               {booking.status === 'Assigned' && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col md:flex-row justify-between items-center gap-3">
                    
                    {editingTechBookingId === booking.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <select 
                          value={newTechnicianName} 
                          onChange={(e) => setNewTechnicianName(e.target.value)}
                          className="p-2 border border-blue-300 rounded-md text-sm w-full font-semibold focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="">-- Naya Ladka Select Karein --</option>
                          {staffList.map(staff => (
                            <option key={staff.id} value={staff.username}>{staff.username} ({staff.trade || "Worker"})</option>
                          ))}
                        </select>
                        
                        <button 
                          onClick={() => handleReassignTechnician(booking.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 whitespace-nowrap shadow-sm"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingTechBookingId(null)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-400 whitespace-nowrap shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 text-blue-800 text-sm font-medium">
                          <span className="text-xl">👨‍🔧</span>
                          <p>
                            Yeh kaam <b className="font-extrabold text-blue-900">{booking.assigned_technician}</b> ko de diya gaya hai.
                          </p>
                          <button 
                            onClick={() => setEditingTechBookingId(booking.id)}
                            className="ml-2 text-xs font-bold bg-white text-blue-700 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors shadow-sm"
                          >
                            🔄 Change
                          </button>
                        </div>
                        
                        <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 text-blue-800 font-extrabold text-sm shadow-sm whitespace-nowrap">
                          OTP: <span className="text-lg tracking-widest">{booking.completion_otp}</span>
                        </div>
                      </>
                    )}
                    
                  </div>
                )}
                {booking.status === 'Verified' && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg font-medium border border-green-100">
                    💰 Deal Done! Final Amount: <b>₹{booking.final_amount}</b>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
        
        {/* NAYA TAB: STAFF MANAGEMENT (SMART UI) */}
        {activeTab === 'STAFF' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            
            {/* TOP BAR: Search Box aur Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="w-full sm:w-1/2 relative">
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Technician ka naam ya kaam (Trade) search karein..." 
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  value={searchTech}
                  onChange={(e) => setSearchTech(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAddTechModal(true)}
                className="w-full sm:w-auto bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>➕</span> Naya Add Karein
              </button>
            </div>

            {/* LIST OF TECHNICIANS */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {staffList
                // 1. Pehle Search Filter lagayenge
                .filter(staff => 
                  staff.username.toLowerCase().includes(searchTech.toLowerCase()) || 
                  (staff.trade && staff.trade.toLowerCase().includes(searchTech.toLowerCase()))
                )
                // 2. Phir check karenge kaun Free hai aur kaun Busy
                .map(staff => {
                  const isBusy = bookings.some(b => b.status === 'Assigned' && b.assigned_technician === staff.username);
                  return { ...staff, isFree: !isBusy };
                })
                // 3. Phir Sort karenge (Free wale upar aayenge)
                .sort((a, b) => (a.isFree === b.isFree ? 0 : a.isFree ? -1 : 1))
                // 4. Ab list ko screen par dikhayenge
                // 4. Ab list ko screen par dikhayenge
                .map((staff) => (
                  <div key={staff.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* LEFT SIDE: Technician ka Photo, Naam aur Trade */}
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-full shadow-sm text-2xl border border-gray-100">👨‍🔧</div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-lg">{staff.username}</p>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{staff.trade || "General Worker"}</p>
                      </div>
                    </div>
                    
                    {/* RIGHT SIDE: Status Badge, ID aur Delete Button */}
                    <div className="flex items-center gap-4">
                      {/* FREE / ON JOB STATUS BADGE */}
                      {staff.isFree ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Free
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span> On Job
                        </span>
                      )}
                      
                      <span className="text-xs font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded-md">ID: #{staff.id}</span>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-red-500 hover:bg-red-100 bg-white border border-red-200 p-1.5 rounded-md transition-colors shadow-sm active:scale-95"
                        title="Delete Technician"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                ))}
                    
               
                {/* Agar search karne par koi na mile */}
                {staffList.length > 0 && staffList.filter(s => s.username.toLowerCase().includes(searchTech.toLowerCase())).length === 0 && (
                  <div className="text-center text-gray-500 py-10 font-medium">Koi technician nahi mila. 🕵️‍♂️</div>
                )}
            </div>

            {/* POPUP MODAL (Add Technician Form) */}
            {showAddTechModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setShowAddTechModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>

                  <h3 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-2">➕ Naya Technician</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Set Username</label>
                      <input 
                        type="text" 
                        value={newTechUsername} 
                        onChange={(e) => setNewTechUsername(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black bg-gray-50" 
                        placeholder="Jaise: rahul_ac" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Set Password</label>
                      <input 
                        type="text" 
                        value={newTechPassword} 
                        onChange={(e) => setNewTechPassword(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black bg-gray-50" 
                        placeholder="Koyi aasan password rakhein" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Select Trade (Kaam)</label>
                      <select 
                        value={newTechTrade} 
                        onChange={(e) => setNewTechTrade(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black bg-gray-50"
                      >
                        <option value="">-- Kaam Select Karein --</option>
                        <option value="Home Cleaning">Home Cleaning & Tank Cleaning</option>
                        <option value="AC & Appliances">AC & Appliances</option>
                        <option value="Solar Cleaning">Solar Cleaning</option>
                       
                      </select>
                    </div>


                    {/* 👇 NAYA: Mobile Number ka dibba yahan add kiya hai 👇 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                      <input 
                        type="number" 
                        value={newTechPhone} 
                        onChange={(e) => setNewTechPhone(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black bg-gray-50" 
                        placeholder="Ladke ka 10-digit number" 
                      />
                    </div>
                    {/* 👆 ---------------------------- 👆 */}

                    <button 
                      onClick={handleCreateStaff} 
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg mt-2"
                    >
                      Account Banayein
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;