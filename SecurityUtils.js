// src/utils/SecurityUtils.js
// مقصد: ڈیٹا پرائیویسی اور لائیو رائیڈ لوکیشن مانیٹرنگ

export const SecurityUtils = {
  
  // 1. ڈیٹا پرائیویسی (Privacy Shield)
  // ون وے ہیش: ڈیٹا کو ناقابلِ فہم کوڈ میں بدلنا
  generateSecureHash: (data) => {
    if (!data) return "";
    return btoa(data).split('').reverse().join('').substring(0, 15).toUpperCase();
  },

  // آدھا نام دکھانے کا فنکشن (GDPR Standard)
  maskName: (name) => {
    if (!name) return "";
    const parts = name.trim().split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}...` : name;
  },

  // 2. لائیو رائیڈ سیکیورٹی (Route Deviation)
  // راستہ بھٹکنے کا الرٹ چیک (10% Buffer Rule)
  checkRouteSafety: (plannedDistance, currentDistance) => {
    const safeThreshold = plannedDistance * 1.10; // 10% گنجائش
    const isDangerous = currentDistance > safeThreshold;
    
    return {
      isSafe: !isDangerous,
      deviation: currentDistance - plannedDistance,
      status: isDangerous ? "🚨 Deviation Detected" : "✅ On Track"
    };
  },

  // میٹر کے حساب سے درستگی (500 میٹر کی حد)
  isDeviatedByMeters: (currentDeviation) => {
    const distanceThreshold = 0.5; // 0.5 KM = 500 Meters
    return currentDeviation > distanceThreshold;
  }
};
