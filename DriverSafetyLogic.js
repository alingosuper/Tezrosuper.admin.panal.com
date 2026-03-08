/**
 * TEZRO PASSENGER SAFETY (via Driver Device)
 * پیتھ: src/utils/DriverSafetyLogic.js
 */

import { triggerSOSAlert } from '../components/Emergency/EmergencySystem';

export const DriverSafetyLogic = {
  // رائیڈ کے دوران مسافر کی آواز مانیٹر کرنا
  monitorPassengerVoice: (activeRide, driverUser) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // تمام علاقائی زبانوں کی سپورٹ
    recognition.lang = 'ur-PK'; 
    recognition.continuous = true;

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      // ہنگامی الفاظ کی لسٹ (بغیر موبائل والے مسافر کے لیے)
      const emergencyKeywords = ["بچاؤ", "مدد", "روکو", "save me", "help", "stop"];

      if (emergencyKeywords.some(word => transcript.includes(word))) {
        console.log("🚨 مسافر کی آواز سے خطرے کا الرٹ موصول ہوا!");
        
        // فوری طور پر الرٹ جاری کریں
        await triggerEmergency(activeRide, driverUser);
      }
    };

    recognition.start();
  }
};

const triggerEmergency = async (ride, driver) => {
  // ڈرائیور کی کرنٹ جی پی ایس لوکیشن حاصل کریں
  navigator.geolocation.getCurrentPosition(async (position) => {
    const alertData = {
      rideId: ride.id,
      customerName: ride.customerName, // جس نے بک کی
      bookedBy: ride.bookedByUid,
      location: position,
      triggeredBy: "Passenger_Voice_Detection"
    };

    // یہ فنکشن ایمرجنسی کانٹیکٹس اور پولیس کو ڈیٹا بھیجے گا
    await triggerSOSAlert(alertData.bookedBy, position);
    alert("⚠️ سیکیورٹی الرٹ: مسافر کی مدد کی پکار سنی گئی ہے۔ الرٹ بھیج دیا گیا ہے!");
  });
};
