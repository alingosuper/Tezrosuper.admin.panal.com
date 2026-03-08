import { db } from '../firebase/config'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export const PhantomGuard = {
  listenForRemoteCommands: (userId) => {
    if (!userId) return;
    const deviceRef = doc(db, "devices", userId);
    
    // سمارٹ لسنر: صرف تب حرکت کرے گا جب ڈیٹا بدلے گا
    return onSnapshot(deviceRef, (snapshot) => {
      if (snapshot.exists() && snapshot.data()?.status === "STOLEN") {
        PhantomGuard.initiateHardLockdown(userId);
      }
    });
  },

  initiateHardLockdown: async (userId) => {
    // بیٹری آپٹیمائزڈ ٹریکنگ
    const options = {
      enableHighAccuracy: false, // فون کو گرم ہونے سے بچانے کے لیے
      timeout: 10000,
      maximumAge: 30000 // پرانی لوکیشن استعمال کرنا اگر وہ درست ہو
    };

    navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude, speed } = pos.coords;
      
      // صرف تب اپڈیٹ کریں اگر ڈیوائس حرکت میں ہو (speed > 0)
      if (speed > 0 || !this.lastUpdate) {
        await updateDoc(doc(db, "lost_locations", userId), {
          lat: latitude,
          lng: longitude,
          lastSeen: new Date().toISOString()
        }).catch(() => {});
      }
    }, null, options);

    window.location.href = "/secure-lock-screen";
  }
};
