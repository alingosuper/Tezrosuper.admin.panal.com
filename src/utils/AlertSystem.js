export const AlertSystem = {
  triggerEmergency: (rideData) => {
    // بیٹری بچانے کے لیے وائبریشن صرف ایک بار
    if (navigator.vibrate) navigator.vibrate(500);

    const msg = `🚨 SOS: ${rideData.riderName} کو مدد درکار ہے! رائیڈ: ${rideData.plateNo}`;
    
    // تمام نمبرز کو ایک ہی لوپ میں ہینڈل کریں
    const alerts = rideData.emergencyContacts.map(phone => AlertSystem.sendSMS(phone, msg));
    
    AlertSystem.notifyAdmin(rideData, null, "MANUAL_SOS");
    return Promise.all(alerts);
  },

  sendSMS: (number, message) => {
    // بیک گراؤنڈ میں خاموشی سے کام کرنا
    console.log(`📡 Sending Encrypted SMS to: ${number}`);
    // ٹویلیو (Twilio) یا دیگر API کال یہاں ہوگی
  }
};
