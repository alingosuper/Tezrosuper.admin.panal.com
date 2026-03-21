import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase";

export const startGhostMonitoring = (userId) => {
    const db = getDatabase(app);
    const userRef = ref(db, `logs/${userId}`);
    
    console.log("🛡️ Ghost Mode: Monitoring User " + userId);
    
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.alert === "SUSPICIOUS") {
            alert("⚠️ Alert: Suspicious activity detected in User App!");
        }
    });
};
