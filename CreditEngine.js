export const PredictiveCreditEngine = {
    calculateLoanEligibility: (userData, activityLogs) => {
        let trustScore = 0;

        // 📊 وہی میٹرکس جو آپ نے دیے (محفوظ)
        if (activityLogs.orderGrowthRate > 0.20) trustScore += 30;
        if (activityLogs.avgSessionTime > 15) trustScore += 15;
        if (activityLogs.onTimeRepaymentRate > 0.98) trustScore += 40;
        if (activityLogs.anomalyDetected) trustScore -= 60; // 🚨 فراڈ چیک

        const baseLimit = userData.monthlyTurnover * 0.5;
        const suggestedLimit = baseLimit + (trustScore * 100);

        return {
            eligibleAmount: Math.max(0, suggestedLimit),
            interestRate: trustScore > 80 ? "0.5%" : "1.2%",
            isJIT_Offer: activityLogs.stockRunningLow && activityLogs.highDemand
        };
    }
};

export const AutoRepaymentEngine = {
    processIncomingRevenue: (riderId, totalFare, loanStatus) => {
        if (loanStatus?.hasActiveDebt) {
            const deduction = totalFare * 0.10; // 10% کٹوتی (محفوظ)
            return { 
                status: "DEBT_REDUCED", 
                deducted: deduction, 
                remaining: totalFare - deduction 
            };
        }
        return { status: "FULL_CREDIT", amount: totalFare };
    }
};
