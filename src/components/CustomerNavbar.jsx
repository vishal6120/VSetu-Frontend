import React, { useState, useRef } from 'react'; // NAYA: useRef add kiya hai
import { useNavigate } from 'react-router-dom';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  
  // LocalStorage se data nikalna
  const isAuth = localStorage.getItem('isAuthenticated');
  const userPhone = localStorage.getItem('userPhone');
  const userName = localStorage.getItem('userName');

  // Menu aur Photo ke States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('userProfilePic') || null);

  // NAYA: Chhupe hue file input ko control karne ke liye ek 'Remote Control' (Ref)
  const fileInputRef = useRef(null);

  // NAYA: Photo upload aur save karne ka Engine
  const handlePhotoChange = (event) => {
    const file = event.target.files[0]; // Customer ne jo photo select ki
    if (file) {
      const reader = new FileReader(); // Photo padhne wala engine
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String); // Screen par turant photo badal do
        localStorage.setItem('userProfilePic', base64String); // Browser ki memory me hamesha ke liye save kar do
        setIsProfileMenuOpen(false); // Menu band kar do
      };
      reader.readAsDataURL(file); // Photo ko text mein badal kar save karna
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfilePic'); // NAYA: Logout par photo bhi hata do
    navigate('/login'); 
  };

  return (
    <nav className="bg-white shadow-sm p-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo (NAYA UPDATE: Icon dabane par Refresh hoga) */}
        <div 
          onClick={() => window.location.href = "/"} 
          className="font-bold text-2xl text-black flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          title="Home par jayein aur Refresh karein"
        >
          <span className="bg-black text-white px-2 py-1 rounded-md">VS</span>
          VSetu
        </div>
        
        {/* Right Side: Profile Menu ya Login Button */}
        <div className="flex items-center gap-4 relative">
          {isAuth ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-black"> {userName}</p>
              </div>
              
              {/* --- NAYA: Asli File Input (Jo chhipa hua hai 'hidden' class se) --- */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                className="hidden" 
              />
              {/* ------------------------------------------------------------------ */}

              {/* Gol Profile Photo */}
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden hover:border-black transition-all focus:outline-none shadow-sm"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {userName ? userName.charAt(0).toUpperCase() : "👤"}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-14 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 border-b border-gray-100 sm:hidden">
                    <p className="font-bold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">+91 {userPhone}</p>
                  </div>
                  
                  {/* --- NAYA: Is button ko dabane se wo chhipa hua input click ho jayega --- */}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    📷 Change Photo
                  </button>
                  {/* ----------------------------------------------------------------------- */}

                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false); // Menu band karo
                      navigate('/my-bookings'); // Naye page par bhej do
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-2"
                  >
                    📋 My Bookings
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;