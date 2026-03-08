export const AIDispatcher = {
  findBestDriver: (drivers, pickupLocation) => {
    if (!drivers.length) return null;

    let bestDriver = null;
    let minScore = Infinity;

    for (const driver of drivers) {
      if (!driver.isOnline || driver.currentRideId) continue;

      const distance = calculateDistance(driver.location, pickupLocation);
      let score = distance;

      // ڈائریکشن بونس (پٹرول بچانے کے لیے)
      if (driver.heading === pickupLocation.direction) score *= 0.8; 

      if (score < minScore) {
        minScore = score;
        bestDriver = { ...driver, score };
      }
    }
    return bestDriver;
  }
};

// درست اور تیز فاصلہ معلوم کرنے کا طریقہ
function calculateDistance(l1, l2) {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((l2.lat - l1.lat) * p)/2 + 
            c(l1.lat * p) * c(l2.lat * p) * (1 - c((l2.lng - l1.lng) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
