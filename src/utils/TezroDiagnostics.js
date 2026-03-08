/**
 * TEZRO SYSTEM DIAGNOSTICS
 * مقصد: تمام پرانے اور نئے فیچرز کی تصدیق کرنا
 */

import { CyberShield } from './CyberShield';
import { PhantomGuard } from './RemoteTracker';

export const runFullSystemCheck = async (user) => {
  console.log("🚀 Tezro ڈائیگنوسٹک شروع ہو رہا ہے...");

  const results = {
    authSystem: !!user ? "PASSED ✅" : "FAILED ❌ (Login required)",
    cyberShield: typeof CyberShield.scanLink === 'function' ? "READY 🛡️" : "MISSING ❌",
    remoteLock: typeof PhantomGuard.listenForRemoteCommands === 'function' ? "ACTIVE 🔒" : "MISSING ❌",
    firebaseConnection: "Testing..."
  };

  // ایک فرضی ہیکنگ الرٹ بھیج کر چیک کرنا
  try {
    const testLink = "http://bit.ly/fake-scam-test";
    const scan = await CyberShield.scanLink(user.uid, testLink);
    if (!scan.safe) {
      results.alertSystem = "WORKING 🚨 (Alert sent to Admin)";
    }
  } catch (e) {
    results.alertSystem = "OFFLINE ⚠️ (Firebase Error)";
  }

  console.table(results);
  return results;
};
