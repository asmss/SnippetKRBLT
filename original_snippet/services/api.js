// src/services/api.js

import axios from 'axios';

const NGROK_PUBLIC_URL = process.env.EXPO_PUBLIC_API_URL; 

const NODE_API_URL = `${NGROK_PUBLIC_URL}/api/assistant/ask`;


export const askAsimGPT = async (prompt) => {
    try {
        const response = await axios.post(NODE_API_URL, {
            prompt: prompt,
        });

        if (response.data && response.data.success) {
            return response.data.answer;
        } else {
            return "Sunucudan beklenmeyen bir cevap formatı alındı.";
        }
    } catch (error) {
        console.error("API Bağlantı Hatası:", error);
        
        if (error.request && !error.response) {
            throw new Error(`Ağ Hatası: Global API'ye ulaşılamıyor. Ngrok tünelini (${NGROK_PUBLIC_URL}) kontrol edin.`);
        }
        throw new Error("Bilinmeyen bir iletişim hatası oluştu.");
    }
};