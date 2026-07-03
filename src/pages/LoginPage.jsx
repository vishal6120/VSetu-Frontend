import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 NAYA: Notification Engine ko yahan import kiya hai 👇
import { startNotificationEngine } from "../NotificationService";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  // step 1 = Phone Number mangna, step 2 = OTP mangna
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  // NAYE STATES: Screen par dynamic OTP rokne aur alert dikhane ke liye
  const [receivedOtp, setReceivedOtp] = useState(""); 
  const [showOtpAlert, setShowOtpAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Bhejne ka function (Ab yeh backend se baat karega!)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {

      setIsLoading(true);

      try {
        // Hum kya kar rahe hain: Backend ke login endpoint ko call kar rahe hain
        const response = await fetch("https://vsetu-backend.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username: phoneNumber, password: "no-password-needed" }) // Username mein phone bhej rahe hain
        });

        if (response.ok) {
          const data = await response.json();
          setReceivedOtp(data.screen_otp);
          setShowOtpAlert(true);
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('role', data.role);
          setStep(2); 
        } else {
          const errData = await response.json();
          alert(errData.detail || "Yeh number ya username registered nahi hai!");
        }
      } catch (error) {
        console.error("Backend Error:", error);
        alert("Backend chal raha hai ya nahi ek baar terminal mein check karein!");
      } finally {
        setIsLoading(false); // Server ka jawab aate hi spinner band (try/catch ke bilkul end mein)
      }

    } else {
      alert("Kripaya sahi 10-digit ka mobile number daalein.");
    }
  };

  // OTP Verify karne ka function
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    
    if (otp === receivedOtp) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userPhone', phoneNumber);
      localStorage.setItem('userName', name);
      
      const userRole = localStorage.getItem('role');
      console.log("Logged in role:", userRole); // Debug karne ke liye console mein dekhein

      // Yahan Role check karke sahi raste par bhej rahe hain
  if (userRole === 'superadmin') {
    startNotificationEngine('all_managers'); // <-- NAYA JODA HAI
    navigate('/superadmin');
  } else if (userRole === 'admin') {
    startNotificationEngine('all_managers'); // <-- NAYA JODA HAI
    navigate('/admin');
  } else if (userRole === 'technician') { 
    startNotificationEngine(phoneNumber); 
    console.log("Notification Engine Started for technician:", phoneNumber);
    navigate('/technician'); 
  } else {
    navigate('/'); // Customer dashboard (yahan engine start nahi karna hai)
  }

    } else {
      alert(`Galat OTP!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="font-extrabold text-3xl text-black flex items-center justify-center gap-2 mb-2">
            <span className="bg-black text-white px-3 py-1.5 rounded-lg">VS</span>
            VSetu
          </div>
          <p className="text-gray-500 font-medium">Log in ya Sign up karein</p>
        </div>

        {/* Green Box Code Jo Screen Par OTP Dikhayega (Sirf Step 2 me dikhega) */}
        {showOtpAlert && step === 2 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-green-700 text-xs font-bold uppercase tracking-wider mb-1">
              🚀 [VSetu Safety Check] Aapka Login OTP:
            </p>
            <h2 className="text-3xl font-black text-green-800 tracking-[0.5em] pl-[0.5em]">
              {receivedOtp}
            </h2>
            <p className="text-gray-500 text-[11px] mt-1">
              Kripya yeh code neeche daal kar enter karein.
            </p>
          </div>
        )}

        {/* STEP 1: Phone Number Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block mb-2 font-bold text-gray-700">Aapka Naam</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required 
                className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-bold text-lg" 
                placeholder="Pura naam likhein" 
              />
            </div>

            <div>
              <label className="block mb-2 font-bold text-gray-700">Phone Number</label>
              {/* Naya Flex Container: Border bahar lagaya hai taaki over-flow na ho */}
              <div className="flex w-full overflow-hidden rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-black bg-white">
                <span className="inline-flex items-center justify-center px-4 bg-gray-50 text-gray-500 font-bold border-r border-gray-300 flex-shrink-0">
                  +91
                </span>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                  maxLength="10"
                  required 
                  className="flex-1 w-full min-w-0 p-3.5 focus:outline-none font-bold text-lg tracking-wide bg-transparent" 
                  placeholder="98765 43210" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold py-4 rounded-xl shadow-md flex justify-center items-center transition-all ${
                isLoading 
                  ? "bg-gray-600 cursor-not-allowed text-white" 
                  : "bg-black hover:bg-gray-800 active:scale-95 text-white"
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
                "Get OTP"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 font-medium">OTP is number par bheja gaya hai:</p>
              <p className="font-bold text-black mt-1">+91 {phoneNumber}</p>
              <button 
                type="button" 
                onClick={() => { setStep(1); setShowOtpAlert(false); }} 
                className="text-blue-600 text-sm font-bold mt-2 hover:underline"
              >
                Number badlein?
              </button>
            </div>

            <div>
              <label className="block mb-2 font-bold text-gray-700 text-center">4-Digit OTP Darj Karein</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                maxLength="4"
                required 
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-bold text-2xl tracking-[1em] text-center" 
                placeholder="••••" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-md active:scale-95"
            >
              Login Karein
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default LoginPage;