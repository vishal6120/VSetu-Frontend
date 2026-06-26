import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CustomerNavbar from '../components/CustomerNavbar';
import { App as CapacitorApp } from '@capacitor/app';


// AAPKI LIST KE HISAAB SE DATA
const appData = [
  {
    id: "cleaning",
    title: "Home Cleaning",
    icon: "🧹",
    img: "/services/cleans.png",
    subCategories: [
      {
        tabName: "Full Home Packages",
        img: "/services/home.png",
        items: [
          { name: "1 BHK Package (1 Room, 1 Wash, 1 Kitchen, 1 Hall)",
             price: "₹2000 - ₹2500",
            img: "/services/1bhk.png", },
          { name: "2 BHK Package (2 Room, 2 Wash, 1 Kitchen, 1 Hall)", price: "Price varies",
            img: "/services/2BHK.png"
           },
        ]
      },
      {
        tabName: "Custom Cleaning",
        img: "/services/custom.png",
        items: [
          { name: "Washroom Cleaning", price: "₹500",
            img: "/services/Washroom.png"
           },
          { name: "Sofa Cleaning", price: "₹150 / seat",
            img: "/services/Sofa.png"
           },
          { name: "Fan Cleaning", price: "₹50 / fan",
            img: "/services/Fan.png"
           },
          { name: "Mattress Dry Cleaning (One Side)", price: "₹800",
            img: "/services/oneside.png"
           },
          { name: "Mattress Dry Cleaning (Both Sides)", price: "₹1200 - ₹1500",
            img: "/services/bothside.png"
           },
          { name: "Carpet Cleaning", price: "₹7 - ₹15 / sq.ft",
            img: "/services/carpet.png"
           },
          { name: "Floor and Tile Cleaning", price: "₹4 - ₹5 / sq.ft",
            img: "/services/floor.png"
           },
          { name: "Glass Cleaning", price: "₹8 - ₹15 / sq.ft",
            img: "/services/glass.png"
           },
          { name: "Wall Scratch Cleaning", price: "₹5 - ₹10 / sq.ft",
            img: "/services/wall.png"
           },
          { name: "Cooler Cleaning", price: "₹500 / cooler",
            img: "/services/cooler.png"
           },
          { name: "Aquarium Cleaning", price: "₹1200 - ₹2000",
            img: "/services/fish.png"
           },
        ]
      },
    ]
  },

  {
    id: "pest",
    title: "Pest Control",
    icon: "🦟",
    // Maine yahan bug/pest ka naya icon link lagaya hai
    img: "/services/pest.png", 
    subCategories: [
      {
        tabName: "Pest Control",
        img: "/services/pests.png",
        icon: "🛡️",
        items: [
          { name: "General Pest Control", price: "₹8 - ₹10 / sq.ft",
            img: "/services/General.png"
           },
          { name: "Termite Control (Deemak)", price: "Visit to check" }
        ]
      }
    ]
  },


  {
    id: "ac",
    title: "AC & Appliances",
    icon: "❄️",
    img: "/services/aplainces.png",
    subCategories: [
      {
        tabName: "AC Servicing",
        img: "/services/ACservice.png",
        items: [
          { name: "Split AC Service", price: "₹600 / AC",
            img: "/services/split.png"
           },
          { name: "Window AC Service", price: "₹500 / AC",
            img: "/services/window.png"
           },
          { name: "AC Gas Charging", price: "₹3500 - ₹4000",
            img: "/services/ACgas.png"
           },
        ]
      },
      {
        tabName: "AC Installation",
        img: "/services/ACinstall.png",
        items: [
          { name: "Normal AC Installation", price: "₹1000 - ₹2000",
            img: "/services/normal.png"
           },
          { name: "Cassette AC Installation", price: "₹3000 - ₹5500",
            img: "/services/cassette.png"
           },
          { name: "Tower AC Installation", price: "₹4000 - ₹6000",
            img: "/services/tower.png"
           },
        ]
      },
      {
        tabName: "Kitchen & Fridge",
        img: "/services/kitchen.png",
        items: [
          { name: "Chimney Cleaning (Home)", price: "₹700 - ₹1500",
            img: "/services/chimney.png"
           },
          { name: "Refrigerator Gas Charging", price: "₹2000 - ₹2500",
            img: "/services/refree.png"
           },
          { name: "Refrigerator Repair (PCB/Compressor/Pipe)", price: "Visit to check",
            img: "/services/pcb.png"
           },
        ]
      }
    ]
  },
  {
    id: "tank",
    title: "Tank ",
    icon: "☀️",
    img: "/services/tank.png",
    subCategories: [
      {
        tabName: "Water Tank Cleaning",
        img: "/services/tankclean.png",
        items: [
          { name: "Plastic Tank (500L)", price: "₹400", img: "/services/tankclean.png" },
          { name: "Plastic Tank (2 tanks of 500L)", price: "₹750", img: "/services/2tank.png" },
          { name: "Plastic Tank (1000L)", price: "₹500 / tank", img: "/services/1000L.png" },
          { name: "Plastic Tank (2000L)", price: "₹1000 / tank", img: "/services/200L.png" },
          { name: "Cement Tank", price: "25p - 50p / litre", img: "/services/cement.png" },
        ]
      },
    ]
  },
  {
    id: "solar",
    title: "Solar Cleaning",
    icon: "☀️",
    // Maine yahan Solar panel ka naya icon link lagaya hai
    img: "/services/solar.png",
    subCategories: [
      {
        tabName: "Solar Cleaning",
        img: "/services/solars.png",
        icon: "⚡",
        items: [
           { name: "3KW Solar Cleaning", price: "₹1500 - ₹2000", img: "/services/3KW.png" },
           { name: "5KW Solar Cleaning", price: "₹2000 - ₹3000", img: "/services/5KW.png" },
           { name: "8KW Solar Cleaning", price: "₹3000 - ₹4500", img: "/services/8KW.png" },
           { name: "10KW Solar Cleaning", price: "₹4500 - ₹5500", img: "/services/10KW.png" },
        ]
      }
    ]
  }


];

function BookingPage() {
  const navigate = useNavigate(); 
  const userPhone = localStorage.getItem('userPhone');
  const userName = localStorage.getItem('userName');

  // Sirf ye ek set rahega states ka
  const [name, setName] = useState(userName || "");
  const [phone, setPhone] = useState(userPhone || "");
  const [serviceType, setServiceType] = useState(""); 
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(""); 

  // MODAL KE STATES
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // <--- NAYI LINE
     
useEffect(() => {
    const checkAppIdentity = async () => {
      try {
        const info = await CapacitorApp.getInfo();
        
        // Jasoos ka naya chashma (Ye batayega ki phone mein aakhir ID kya aayi hai)
        alert("Phone mein ye ID aayi hai: " + info.id);
        
        if (info.id === 'com.vsetu.technician') {
          navigate('/technician'); 
        }
      } catch (error) {
        console.log("Capacitor error:", error);
      }
    };

    checkAppIdentity();
  }, [navigate]);



  // CATEGORY CLICK HONE PAR MODAL KHOLNA
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveTabIndex(0);
  };

 // MODAL MEIN 'BOOK' DABANE PAR (With Guest Security)
  const handleSelectServiceFromModal = (serviceName) => {
    // 1. Check karo aapke custom navbar ke mutabik user authentic hai ya nahi
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (!isAuth) {
      // 2. Agar login nahi hai, toh alert do aur login page par bhej do
      navigate('/login');
      return; // Code ko aage mat badhne do (Form nahi khulega)
    }

    // 3. Agar user pehle se logged in hai, toh normal form khol do
    setServiceType(serviceName); 
    setSelectedCategory(null); 
    setIsFormModalOpen(true); 
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage("❌ Aapka browser location support nahi karta.");
      return;
    }

    setIsGettingLocation(true);
    setMessage("Location nikal rahe hain... 📍");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
        
        setAddress((prevAddress) => prevAddress + (prevAddress ? "\n\n" : "") + "📍 Live Location: " + mapLink);
        
        setMessage("✅ Location successfully added Click Confirm button.");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Location Error:", error);
        setMessage("❌ Location nahi mil payi. Kripya GPS/Location on karein aur permission dein.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true } 
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!serviceType) {
      setMessage("❌ Kripya upar list mein se koi service select karein.");
      return;
    }

    setMessage("Booking save ho rahi hai... ⏳");
   // Puraani line ko isse replace karein
  const bookingData = { 
    customer_name: name, 
    phone_number: phone, 
    service_name: serviceType, 
    address: address,
    booking_date: bookingDate, // NAYA
    booking_time: bookingTime  // NAYA
  };

    try {
      const response = await fetch("https://vsetu-backend.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setMessage("✅ We got your current location.");
        setName(""); setPhone(""); setAddress(""); setServiceType("");
      } else {
        setMessage("❌ Kuch gadbad hai. Kripya details check karein.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error! Backend chalu hai ya nahi check karein.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10 font-sans text-gray-800">

    

      
      
      {/* 1. TOP NAVBAR */}
      <CustomerNavbar />

      <div className="max-w-6xl mx-auto px-4 mt-10">


        
        {/* 2. HERO SECTION */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Home services at your doorstep</h1>
        
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          
          {/* LEFT SIDE: Category Grid (Ab 3 Main Categories Dikhayega) */}
          <div className="w-full md:w-5/12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-6 text-gray-800">Select a Category</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              {appData.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  {/* NAYA: p-3 ko p-1 kar diya aur img mein scale-125 laga diya taaki zoom ho jaye */}
                  <div className="bg-gray-50 w-20 h-20 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-gray-100 p-1 overflow-hidden">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-contain opacity-90 hover:opacity-100 scale-125 transition-transform" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700 px-2">{cat.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Photo Collage */}
          <div className="w-full md:w-7/12 grid grid-cols-2 gap-4 h-[400px]">
            
            {/* Badi Photo (Left Side) - Cleaning */}
            <div className="bg-blue-50 rounded-2xl overflow-hidden relative shadow-sm flex items-center justify-center p-6 border border-blue-100">
              <img src="/services/1st.png" alt="Home Cleaning" className="w-full h-full object-contain drop-shadow-xl hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="grid grid-rows-2 gap-4">
              {/* Top Right Photo - AC */}
              <div className="bg-cyan-50 rounded-2xl overflow-hidden relative shadow-sm flex items-center justify-center p-4 border border-cyan-100">
                <img src="/services/2nd.png" alt="AC Service" className="w-full h-full object-contain drop-shadow-lg hover:scale-110 transition-transform duration-500" />
              </div>
              
              {/* Bottom Right Photo - Pest Control */}
              <div className="bg-yellow-50 rounded-2xl overflow-hidden relative shadow-sm flex items-center justify-center p-4 border border-yellow-100">
                <img src="/services/3rd.png" alt="Pest Control" className="w-full h-full object-contain drop-shadow-lg hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            
          </div>

        </div>

        {/* 3. BOOKING FORM MODAL (Pop-up) */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">

              {/* Close (X) Button */}
              <button
                onClick={() => { setIsFormModalOpen(false); setMessage(""); }}
                className="absolute top-4 right-4 bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-2 text-blue-600">Service Book Karein 🛠️</h2>
              <p className="text-gray-500 mb-6 text-sm">Apni details niche bharein.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. SELECTED SERVICE (Premium Badge Look) */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-blue-500 font-extrabold uppercase tracking-wider mb-1">Selected Service</p>
                    <p className="font-bold text-gray-900 text-lg">{serviceType || "Koi service select nahi ki"}</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <span className="text-xl">✅</span>
                  </div>
                </div>

                {/* 2. NAME & PHONE (Grid layout for Desktop, Stack for Mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-gray-700 text-sm">Aapka Naam</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-400">👤</span>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="Pura naam likhein" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-gray-700 text-sm">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-400">📞</span>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                        className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="10-digit number" 
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DATE & TIME (Appointment Slots) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-gray-700 text-sm">Kis Din? (Date)</label>
                    <input 
                      type="date" 
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)} 
                      required 
                      // Peeche ki dates block karne ke liye (Optional par achha hai)
                      min={new Date().toISOString().split("T")[0]} 
                      className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-gray-700" 
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-gray-700 text-sm">Kis Time? (Slot)</label>
                    <select 
                      value={bookingTime} 
                      onChange={(e) => setBookingTime(e.target.value)} 
                      required
                      className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-gray-700"
                    >
                      <option value="">-- Select Time --</option>
                      <option value="Morning (9 AM - 12 PM)">🌅 Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 3 PM)">☀️ Afternoon (12 PM - 3 PM)</option>
                      <option value="Evening (3 PM - 6 PM)">🌇 Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>
                </div>

                {/* 4. ADDRESS & GPS */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block font-bold text-gray-700 text-sm">Pura Address (House, Landmark)</label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 transition-colors shadow-sm flex items-center gap-1"
                    >
                      {isGettingLocation ? "⏳ Getting..." : "📍 Auto Detect"}
                    </button>
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows="2"
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                    placeholder="Jaise: Flat 204, Gomti Nagar..."
                  ></textarea>
                </div>

                {/* 5. SUBMIT BUTTON */}
                <button 
                  type="submit" 
                  className="w-full py-4 mt-2 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                  Confirm Booking <span>➔</span>
                </button>
              </form>

              
              {message && (
                <div className={`mt-4 p-4 rounded-lg font-bold text-center ${message.includes('❌') || message.includes('error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 4. THE POPUP MODAL (Urban Company Style) */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fade-in">
          
          <div className="bg-white w-full md:max-w-2xl h-[85vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex-shrink-0 p-5 border-b flex justify-between items-center bg-white rounded-t-3xl md:rounded-3xl sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCategory.icon}</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* NAYE STYLE KE TABS (Urban Company Style Cards) */}
            <div className="flex-shrink-0 grid grid-cols-3 gap-3 p-4 md:p-6 bg-white border-b">
              {selectedCategory.subCategories.map((sub, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTabIndex(index)}
                  className={`flex flex-col items-center justify-start p-3 md:p-4 rounded-2xl transition-all border-2 ${
                    activeTabIndex === index 
                      ? "bg-blue-50 border-black shadow-md" 
                      : "bg-gray-50 border-transparent hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  {/* Photo ya Emoji ki jagah (Bina Kate Full Photo) */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2">
                    {sub.img ? (
                      /* overflow-hidden hata diya aur scale safe kar diya */
                      <img src={sub.img} alt={sub.tabName} className="w-full h-full object-contain scale-110 drop-shadow-md transition-transform" />
                    ) : (
                      <span className="text-5xl md:text-6xl drop-shadow-sm">
                        {sub.icon ? sub.icon : "📦"} 
                      </span>
                    )}
                  </div>
                  {/* Text */}
                  <span className={`text-xs md:text-sm font-bold text-center leading-tight ${
                    activeTabIndex === index ? "text-black" : "text-gray-600"
                  }`}>
                    {sub.tabName}
                  </span>
                </button>
              ))}
            </div>

           {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white space-y-4">
              {selectedCategory.subCategories[activeTabIndex].items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                  
                  {/* Left Side Photo/Icon Dabba (Bina Kate Full Photo) */}
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-blue-50/50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100 p-2">
                    {item.img ? (
                      /* p-2 lagaya taaki edges ko saans lene ki jagah mile */
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain scale-110 drop-shadow-md" />
                    ) : (
                      <span className="text-5xl md:text-6xl drop-shadow-sm">{selectedCategory.icon}</span>
                    )}
                  </div>

                  {/* Middle: Text aur Price */}
                  <div className="flex-1 pr-2">
                    <h4 className="font-extrabold text-gray-800 text-sm md:text-base leading-tight">{item.name}</h4>
                    <p className="text-gray-500 font-medium mt-1 text-xs md:text-sm">{item.price}</p>
                  </div>
                  
                  {/* Right Side: Book Button */}
                  <button 
                    onClick={() => handleSelectServiceFromModal(item.name)}
                    className="px-5 py-2 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-bold rounded-lg text-sm transition-all shadow-sm active:scale-95 flex-shrink-0"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 

export default BookingPage;