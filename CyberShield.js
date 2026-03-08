import { db } from '../firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const CyberShield = {
  scanLink: async (userId, url) => {
    // فاسٹ ریجیکس (Fast Regex) کا استعمال
    const isMalicious = /bit\.ly|tinyurl\.com|gift-card|free-money/i.test(url);
    
    if (isMalicious) {
      await reportAttack(userId, "PHISHING_LINK", url.substring(0, 50));
      return { safe: false, warning: "⚠️ سیکیورٹی الرٹ: مشکوک لنک بلاک کر دیا گیا۔" };
    }
    return { safe: true };
  }
};

const reportAttack = async (userId, type, details) => {
  try {
    // غیر ضروری ڈیٹا ہٹا کر صرف اہم معلومات بھیجنا
    await addDoc(collection(db, "emergency_alerts"), {
      userId,
      type,
      details,
      status: "ACTIVE",
      timestamp: serverTimestamp() // سرور کا وقت استعمال کریں
    });
  } catch (e) { /* خاموش فیلر تاکہ ایپ کریش نہ ہو */ }
};
