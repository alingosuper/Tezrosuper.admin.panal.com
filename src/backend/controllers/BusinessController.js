// Universal Business Logic Controller
export const BusinessLogic = {
    // کمیشن کا حساب (Standard Rates)
    calculateCommission: (amount, category) => {
        const rates = {
            'food': 0.15,      // 15%
            'ride': 0.10,      // 10%
            'hotel': 0.12,     // 12%
            'vendor': 0.08     // 8% (Amazon/Daraz Style)
        };
        const rate = rates[category] || 0.10;
        return amount * rate;
    },

    // ڈیٹا کی صفائی (تاکہ حساس معلومات فرنٹ اینڈ پر نہ جائیں)
    sanitizeUserPayload: (userDoc) => {
        const { password, privateKey, internalNote, ...publicData } = userDoc;
        return publicData;
    }
};
