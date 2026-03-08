import React, { useState } from 'react';
import { VoiceEngine } from '../utils/VoiceEngine';
import { useAuth } from '../context/AuthContext';

const VoiceCommandHandler = () => {
  const { user } = useAuth(); // یوزر کا ڈیٹا حاصل کرنا
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Ready");

  const startSecureCommand = async () => {
    setIsListening(true);
    setStatus("آواز کی شناخت ہو رہی ہے...");

    // 1. آواز ریکارڈ کرنا (MediaRecorder API)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = async (e) => {
      const liveAudio = e.data;

      // 2. سیکیورٹی چیک: کیا یہ وہی یوزر ہے؟
      const isOwner = await VoiceEngine.verifyOwner(liveAudio, user.voiceSignature);

      if (isOwner) {
        setStatus("شناخت مکمل! کمانڈ پروسیس ہو رہی ہے...");
        processCommand(liveAudio); // صرف مالک کے لیے کمانڈ چلے گی
      } else {
        setStatus("❌ غیر متعلقہ آواز! رسائی مسترد کر دی گئی۔");
        alert("SECURITY ALERT: Voice mismatch detected!");
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000); // 3 سیکنڈ کی ریکارڈنگ
  };

  const processCommand = (audio) => {
    // یہاں Speech-to-Text کا لاجک آئے گا (جیسے OpenAI Whisper)
    console.log("Executing secure command for owner...");
  };

  return (
    <div style={styles.container}>
      <button 
        onMouseDown={startSecureCommand} 
        style={isListening ? styles.activeBtn : styles.micBtn}
      >
        🎤 {isListening ? "بولیں..." : "وائس کمانڈ (Hold)"}
      </button>
      <p style={{ color: '#D4AF37' }}>{status}</p>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '20px' },
  micBtn: { padding: '15px 30px', borderRadius: '50px', background: '#000', color: '#D4AF37', border: '2px solid #D4AF37', cursor: 'pointer' },
  activeBtn: { padding: '15px 30px', borderRadius: '50px', background: '#D4AF37', color: '#000', border: '2px solid #fff', animation: 'pulse 1s infinite' }
};

export default VoiceCommandHandler;
