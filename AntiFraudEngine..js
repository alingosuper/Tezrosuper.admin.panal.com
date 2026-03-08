export const AntiFraudEngine = {
    // آپ کے فراہم کردہ انٹرنیشنل اسٹینڈرڈز (محفوظ)
    RESTRICTED_CATEGORIES: ['7995', '5967', '7273', '6211'], 

    async validateTransaction(userId, cardToken, merchantData) {
        // 1. والٹ ڈیٹا حاصل کریں
        const userVault = await this.getUserVault(userId);
        
        // 2. کیٹیگری چیک (Gambling/High-Risk)
        if (this.RESTRICTED_CATEGORIES.includes(merchantData.mcc)) {
            let warningCount = (userVault.securityWarnings || 0) + 1;

            if (warningCount >= 2) {
                // مستقل بلاک (آپ کا اوریجنل لاجک)
                await this.permBlockCard(cardToken, "PERMANENT_BAN_SUSPICIOUS");
                return { status: "TERMINATED", message: "Card permanently blocked." };
            } else {
                // پہلی وارننگ
                await this.updateWarningCount(userId, warningCount);
                return { 
                    status: "REJECTED", 
                    message: `WARNING ${warningCount}/2: This type is prohibited.` 
                };
            }
        }
        return { status: "AUTHORIZED" };
    }
};
