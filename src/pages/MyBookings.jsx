import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';

const MyBookings = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userPhone = localStorage.getItem('userPhone');

  // NAYA: Asli data save karne ke liye state
  const [myPastBookings, setMyPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // NAYA: Page khulte hi Backend se data laane ka Engine
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userPhone) return;
      
      try {
        // FastAPI backend ko call lagana
        const response = await fetch(`http://localhost:8000/api/bookings/customer/${userPhone}`);
        if (response.ok) {
          const data = await response.json();
          setMyPastBookings(data); // Asli data state mein save kar diya
        } else {
          console.error("Data laane mein dikkat hui");
        }
      } catch (error) {
        console.error("Backend server se connect nahi ho paya:", error);
      } finally {
        setIsLoading(false); // Loading animation band karo
      }
    };

    fetchBookings();
  }, [userPhone]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <CustomerNavbar />

      <div className="max-w-4xl mx-auto px-4 mt-8 pb-12">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm font-bold text-xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">{userName} ke sabhi orders</p>
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading ? (
          <div className="text-center text-gray-500 font-bold py-10 animate-pulse">
            Aapki bookings dhoondh rahe hain... ⏳
          </div>
        ) : myPastBookings.length === 0 ? (
          /* Agar koi booking nahi mili */
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <span className="text-4xl block mb-3">📭</span>
            <h3 className="text-lg font-bold text-gray-800">Koi Booking Nahi Mili</h3>
            <p className="text-gray-500 text-sm mt-2">Aapne abhi tak koi service book nahi ki hai.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800"
            >
              Service Book Karein
            </button>
          </div>
        ) : (
          /* Asli Bookings ki List */
          <div className="space-y-4">
            {myPastBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-2 inline-block">
                      BKG-{booking.id}
                    </span>
                    <h3 className="text-xl font-bold text-black">{booking.service_name}</h3>
                  </div>
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-gray-400 font-bold text-xs uppercase mb-1">Date</p>
                    <p className="font-bold text-gray-800">{booking.booking_date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold text-xs uppercase mb-1">Time</p>
                    <p className="font-bold text-gray-800">{booking.booking_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold text-xs uppercase mb-1">Address</p>
                    <p className="font-bold text-gray-800 truncate">{booking.address}</p>
                  </div>
                  <div className="flex items-end md:justify-end">
                    {booking.status === 'Completed' && (
                      <button className="text-blue-600 font-bold hover:underline text-sm">
                        Re-book ➔
                      </button>
                    )}
                  </div>
                </div>

               {/* --- NAYA: Technician Details aur OTP --- */}
                {booking.assigned_technician && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-4 shadow-sm animate-fade-in">
                   
                   {/* Upar ka hissa: Naam, Photo aur Buttons */}
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-blue-200 text-2xl rounded-full flex items-center justify-center shadow-sm">
                          👷‍♂️
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider mb-0.5">Assigned Technician</p>
                          <p className="font-bold text-gray-900 text-base md:text-lg leading-tight">{booking.assigned_technician}</p>
                          <p className="text-gray-500 text-xs md:text-sm font-bold mt-0.5 tracking-wide">
                            +91 {booking.technician_phone || "Number Updating..."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                          <a 
                            href={`tel:+91${booking.technician_phone}`} 
                            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 border shadow-sm transition-colors ${
                              booking.technician_phone ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none'
                            }`}
                          >
                            📞 Call
                          </a>
                          <a 
                            href={`https://wa.me/91${booking.technician_phone}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 border shadow-sm transition-colors ${
                              booking.technician_phone ? 'bg-[#E8F8F5] text-[#25D366] hover:bg-[#D1F2EB] border-[#25D366]/30' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none'
                            }`}
                          >
                            💬 WhatsApp
                          </a>
                      </div>
                    </div>

                    {/* 👇👇 NAYA: STATUS KE HISAAAB SE OTP YA SUCCESS MESSAGE & PAYMENT 👇👇 */}
                    {booking.status === 'Verified' || booking.status === 'Completed' ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-xl mt-2 shadow-sm flex flex-col items-center">
                        <p className="text-green-700 font-bold flex items-center justify-center gap-2 text-lg">
                          ✅ Work Done
                        </p>
                        <p className="text-sm text-green-600 mt-1 mb-4 font-medium text-center">VSetu chunne ke liye dhanyawad.</p>
                        
                        {/* --- NAYA: Payment ki Mini-Receipt --- */}
                        <div className="bg-white border border-green-100 rounded-lg w-full max-w-xs p-3 flex justify-between items-center shadow-sm">
                          <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Final Payment</span>
                          <span className="text-green-700 font-black text-xl">₹ {booking.final_amount || "0"}</span>
                        </div>
                        {/* ----------------------------------- */}

                      </div>
                    ) : (
                      <div className="bg-white border-2 border-dashed border-blue-300 p-4 rounded-xl text-center mt-2 shadow-inner">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Kaam complete hone par ye OTP dein</p>
                        <p className="text-4xl font-black tracking-widest text-black">{booking.completion_otp || "N/A"}</p>
                      </div>
                    )}
                    {/* 👆👆 ---------------------------------------------------- 👆👆 */}
                    {/* 👆👆 ---------------------------------------------------- 👆👆 */}

                  </div>
                )}
                {/* ------------------------------------------------------------------ */}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;