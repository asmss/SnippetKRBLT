const express = require('express');
const fetch = require('node-fetch'); 
const router = express.Router();

const OLLAMA_URL = 'http://localhost:11434/api/generate'; 

router.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Soru alanı boş olamaz.' });
    }

    try {
        const ollamaResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'asim-rag-assistant', 
                prompt: prompt,
                stream: false, 
            }),
        });

        const data = await ollamaResponse.json();

        const finalResponse = data.response ? data.response.trim() : "Model yanıt üretemedi.";

        res.json({ success: true, answer: finalResponse });

    } catch (error) {
        console.error('Ollama API Hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Yerel yapay zeka sunucusuna (Ollama) ulaşılamadı. Çalışıyor mu?' 
        });
    }
});

module.exports = router;