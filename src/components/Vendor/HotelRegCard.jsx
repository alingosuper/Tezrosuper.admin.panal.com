import React from "react";

export default function HotelRegCard({ guestName, roomType, stayDuration }) {
  return (
    <div style={{ 
      background: "linear-gradient(135deg, #111, #222)", 
      border: "2px solid #39FF14", 
      padding: "20px", 
      borderRadius: "15px", 
      width: "300px", 
      margin: "20px auto",
      boxShadow: "0 0 20px rgba(57, 255, 20, 0.2)"
    }}>
      <h3 style={{ color: "#39FF14", textAlign: "center" }}>Tezro Hotel Card</h3>
      <hr style={{ borderColor: "#333" }} />
      <p><b>مہمان کا نام:</b> {guestName || "نام درج کریں"}</p>
      <p><b>روم کیٹیگری:</b> {roomType || "Standard"}</p>
      <p><b>مدتِ قیام:</b> {stayDuration || "1 Day"}</p>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TezroGuest" alt="QR Code" />
        <p style={{ fontSize: "10px" }}>Scan for Check-in</p>
      </div>
    </div>
  );
}

