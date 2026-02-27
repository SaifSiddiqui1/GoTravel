const express = require('express');
const router = express.Router();
const aiService = require('../services/ai.service');
const { protect } = require('../middleware/auth');

// POST /api/ai/itinerary - generate itinerary
router.post('/itinerary', async (req, res) => {
    try {
        const { destinationName, state, days, preferences } = req.body;
        if (!destinationName || !days) return res.status(400).json({ success: false, error: 'destinationName and days required.' });
        const itinerary = await aiService.generateItinerary(destinationName, state, days, preferences);
        res.json({ success: true, data: itinerary });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/suggest-addons - suggest FIT add-ons
router.post('/suggest-addons', async (req, res) => {
    try {
        const { destinationName, currentItinerary, existingAddOns } = req.body;
        const suggestions = await aiService.suggestAddOns(destinationName, currentItinerary, existingAddOns);
        res.json({ success: true, data: suggestions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/chat - chatbot
router.post('/chat', async (req, res) => {
    try {
        const { messages, context } = req.body;
        if (!messages?.length) return res.status(400).json({ success: false, error: 'messages required.' });
        const reply = await aiService.chatbot(messages, context || {});
        res.json({ success: true, data: reply });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/description (admin) - generate destination description
router.post('/description', protect, async (req, res) => {
    try {
        const { name, state, highlights } = req.body;
        const description = await aiService.generateDestinationDescription(name, state, highlights || []);
        res.json({ success: true, data: description });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/faqs - generate FAQs
router.post('/faqs', async (req, res) => {
    try {
        const { destinationName, state } = req.body;
        const faqs = await aiService.generateFAQs(destinationName, state);
        res.json({ success: true, data: faqs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
