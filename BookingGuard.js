/**
 * TEZRO SUPER BOOKING GUARD (The Risk & Security Engine)
 * یہ فائل صارف کی اہلیت، سروس کے رولز اور پیمنٹ پالیسی کو کنٹرول کرتی ہے
 */

import { db, auth } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export const BookingGuard = {
  
  /**
   * 1. صارف کی بنیادی اہلیت چیک کرنا (Database Check)
   */
  canUserBook: async () => {
    const user = auth.currentUser;
    if (!user) return { allowed: false, reason: "NOT_LOGGED_IN" };

    try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (!profileSnap.exists()) return { allowed: false, reason: "USER_NOT_FOUND" };
        
        const data = profileSnap.data();

        if (data.isBlocked) return { allowed: false, reason: "ACCOUNT_SUSPENDED" };
        if (data.pendingDues > 0) return { allowed: false, reason: "OUTSTANDING_BALANCE" };
        if (data.currentRideId) return { allowed: false, reason: "ALREADY_IN_RIDE" };

        return { allowed: true };
    } catch (error) {
        console.error("BookingGuard Error:", error);
        return { allowed: false, reason: "SYSTEM_ERROR" };
    }
  },

  /**
   * 2. سروس کی قسم اور مالیت کی بنیاد پر ریکوائرمنٹس (Business Logic)
   */
  getServiceRequirements: (serviceType, orderValue = 0) => {
    const baseConfig = {
      title: "کنفرمیشن",
      fields: ["fullName", "phone"],
      payment: "CASH_ON_DELIVERY",
      securityLevel: 1, 
    };

    const configs = {
      RIDE: {
        title: "Rider Verification",
        fields: ["fullName", "phone", "emergencyContacts", "selfie_auth"],
        payment: orderValue > 10000 ? "WALLET_HOLD_MANDATORY" : "CASH_OR_WALLET",
        securityLevel: 2
      },
      FOOD: {
        title: "Order Details",
        fields: ["fullName", "phone", "address"],
        payment: orderValue > 5000 ? "PARTIAL_ADVANCE_30" : "CASH_ON_DELIVERY",
        securityLevel: 1
      },
      HOTEL: {
        title: "Guest Security Verification",
        fields: ["fullName", "phone", "cnic_passport", "address"],
        payment: "ADVANCE_BOOKING_FEE",
        securityLevel: 2
      },
      FUNCTION_HALL: {
        title: "Event Security & Booking",
        fields: ["fullName", "phone", "cnic_passport", "address", "liability_agreement"],
        payment: "50_PERCENT_ADVANCE_MANDATORY",
        securityLevel: 3
      }
    };

    return { ...baseConfig, ...(configs[serviceType] || {}) };
  },

  /**
   * 3. کینسلشن پالیسی چیکر
   */
  canCancelWithRefund: (serviceType, hoursBefore) => {
    const policies = {
      RIDE: 0.1, // 6 منٹ
      FOOD: 0,
      HOTEL: 24,
      FUNCTION_HALL: 72,
    };
    
    const limit = policies[serviceType] || 0;
    return hoursBefore >= limit;
  }
};
