export const AutoRepaymentEngine = {
    processIncomingRevenue: async (riderId, totalFare) => {
        const loanStatus = await this.getLoanStatus(riderId);

        if (loanStatus?.hasActiveDebt) {
            // 10% کٹوتی کا فارمولا (آپ کا اصل لاجک)
            const deductionAmount = totalFare * 0.10;
            const remainingFare = totalFare - deductionAmount;

            // بیک گراؤنڈ میں لیجر اپڈیٹ کریں
            await this.updateDebtAndWallet(riderId, deductionAmount, remainingFare);

            return { 
                status: "DEBT_REDUCED", 
                deducted: deductionAmount,
                riderProfit: remainingFare 
            };
        }
        return { status: "FULL_CREDIT", amount: totalFare };
    }
};
