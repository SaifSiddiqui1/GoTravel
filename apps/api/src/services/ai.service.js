const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate a detailed day-by-day itinerary for a destination
 */
exports.generateItinerary = async (destinationName, state, days, preferences = {}) => {
    const prompt = `You are an expert Indian travel planner. Generate a detailed ${days}-day travel itinerary for ${destinationName}, ${state}, India.

Traveler preferences: ${JSON.stringify(preferences)}

Return ONLY a valid JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "day": 1,
    "title": "Arrival & City Exploration",
    "description": "Detailed description of the day",
    "activities": ["Activity 1", "Activity 2", "Activity 3"],
    "meals": ["breakfast", "lunch", "dinner"],
    "accommodation": "Hotel/stay name or type",
    "transport": "How to get around",
    "tips": "Local tips for this day"
  }
]

Make it authentic, culturally rich, and practical for Indian travelers. Include local food recommendations, hidden gems, and timing tips.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No valid JSON in AI response');
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('AI itinerary generation failed:', err.message);
        throw new Error('Failed to generate itinerary');
    }
};

/**
 * Generate destination description for SEO
 */
exports.generateDestinationDescription = async (name, state, highlights) => {
    const prompt = `Write an engaging, SEO-optimized travel description for ${name}, ${state}, India.
Key highlights: ${highlights.join(', ')}.
Write 3 paragraphs (total ~300 words). Be vivid, inspiring, and factually accurate. No markdown formatting.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (err) {
        console.error('AI description generation failed:', err.message);
        throw new Error('Failed to generate description');
    }
};

/**
 * Suggest FIT add-ons based on current itinerary
 */
exports.suggestAddOns = async (destinationName, currentItinerary, existingAddOns) => {
    const prompt = `You are a travel expert. A traveler is visiting ${destinationName}, India.
Current itinerary: ${JSON.stringify(currentItinerary).slice(0, 1000)}
Available activities: ${JSON.stringify(existingAddOns.map(a => ({ id: a._id, name: a.name, category: a.category }))).slice(0, 1000)}

Recommend the TOP 3 add-on IDs from the available activities that best complement this itinerary.
Return ONLY valid JSON: {"recommendations": ["id1", "id2", "id3"], "reason": "Brief explanation"}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { recommendations: [], reason: '' };
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('AI add-on suggestion failed:', err.message);
        return { recommendations: [], reason: '' };
    }
};

/**
 * AI Travel Chatbot
 */
exports.chatbot = async (messages, context) => {
    const systemContext = `You are GoTravel's friendly AI travel assistant. You help users plan trips in India.
Current destination context: ${JSON.stringify(context)}
Be helpful, concise, friendly. Recommend GoTravel packages when relevant. Always stay on topic of travel planning.`;

    const chatMessages = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
    }));

    try {
        const chat = model.startChat({
            history: chatMessages.slice(0, -1),
            generationConfig: { maxOutputTokens: 500 },
        });
        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(systemContext + '\n\nUser: ' + lastMessage.content);
        return result.response.text();
    } catch (err) {
        console.error('AI chatbot failed:', err.message);
        throw new Error('Chatbot unavailable');
    }
};

/**
 * Generate FAQs for a destination
 */
exports.generateFAQs = async (destinationName, state) => {
    const prompt = `Generate 8 frequently asked questions and answers for travelers to ${destinationName}, ${state}, India.
Return ONLY valid JSON array: [{"question": "...", "answer": "..."}]
Focus on: best time to visit, how to reach, what to pack, safety, budget, local customs, must-eat food, must-see places.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('AI FAQ generation failed:', err.message);
        return [];
    }
};
