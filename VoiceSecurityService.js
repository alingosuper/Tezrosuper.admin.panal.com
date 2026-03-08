/**
 * TEZRO VOICE SECURITY ENGINE
 * پیتھ: src/utils/VoiceSecurityService.js
 */

// 1. آڈیو کو چھوٹے سے سگنیچر (Vector) میں بدلنا (سستی اور سیکیورٹی کے لیے)
export const convertAudioToTinyVector = async (audioBlob) => {
  // یہاں ہم Web Audio API استعمال کرتے ہیں
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // آواز کی لہروں سے ڈیٹا نکالنا (64 پوائنٹ ویکٹر)
  const rawData = audioBuffer.getChannelData(0); 
  const blockSize = Math.floor(rawData.length / 64);
  const vector = [];

  for (let i = 0; i < 64; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[i * blockSize + j]);
    }
    vector.push(sum / blockSize); // آواز کا ایک منفرد نمبر
  }
  return vector; 
};

// 2. ریاضیاتی موازنہ (Cosine Similarity)
export const calculateSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
};
