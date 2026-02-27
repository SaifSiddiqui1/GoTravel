'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minus, Loader2, Sparkles, PhoneCall } from 'lucide-react';
import { aiApi } from '@/lib/api';
import Link from 'next/link';

const QUICK_REPLIES = [
    '🗺️ Show me Kashmir packages',
    '🏖️ Best Goa packages',
    '🏔️ Ladakh adventure trip',
    '💰 Budget under ₹15,000',
    '🍯 Honeymoon packages',
    '⏰ When to visit Kerala?',
];

const SYSTEM_CONTEXT = `You are a friendly and expert GoTravel AI assistant for an India-focused travel booking platform. 
You help users find, customize, and book travel packages across India. 
Available destinations include: Kashmir, Goa, Kerala, Rajasthan, Manali, Andaman Islands, Varanasi, and Leh Ladakh.
All packages include accommodation, meals, and transfers. Prices start from ₹9,999 per person.
Always be helpful, enthusiastic about Indian travel, and guide users toward booking.
Keep responses concise, use emojis to make it friendly. If users want to book, direct them to /booking.
Quote approximate prices when discussing packages.`;

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        {
            role: 'assistant',
            content: "🙏 Namaste! I'm **Aria**, your GoTravel AI assistant.\n\nI can help you:\n- 🗺️ Find the perfect Indian destination\n- ✈️ Customize your travel package\n- 💰 Get the best price for your budget\n- 📅 Plan your perfect itinerary\n\nWhat are you dreaming of exploring today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => { scrollToBottom(); }, [messages, isOpen, isMinimized]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg = text.trim();
        setInput('');
        setShowQuickReplies(false);
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const historyContext = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
            const res = await aiApi.chat({
                message: userMsg,
                context: `${SYSTEM_CONTEXT}\n\nConversation:\n${historyContext}`,
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
        } catch {
            // Smart fallback responses based on keywords
            const lower = userMsg.toLowerCase();
            let reply = '';

            if (lower.includes('kashmir')) {
                reply = "**Kashmir** is absolutely magical! 🏔️\n\nOur **Kashmir Paradise Package** starts at ₹18,999/person for 7 days:\n- Dal Lake houseboat stay\n- Gulmarg Gondola ride\n- Pahalgam Valley & Sonamarg\n- All transfers & meals\n\nWant me to help you [book this package](/booking?destination=kashmir)?";
            } else if (lower.includes('goa')) {
                reply = "**Goa** is party time! 🏖️\n\nOur **Goa Sunshine Package** starts at ₹12,999/person for 5 days:\n- Beachside hotel stay\n- Dudhsagar Falls jeep safari\n- North & South Goa beach tour\n- Optional water sports\n\n[Explore Goa packages](/destinations/goa) and customize your perfect trip!";
            } else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
                reply = "Great news! We have packages for every budget:\n\n💚 **Under ₹15K:** Goa (₹12,999), Varanasi (₹9,999)\n💛 **₹15K-25K:** Kashmir (₹18,999), Manali (₹11,999)\n🧡 **₹25K-40K:** Kerala (₹16,999), Rajasthan (₹21,999)\n❤️ **Premium:** Andaman (₹24,999), Ladakh (₹29,999)\n\nWhich budget range works for you?";
            } else if (lower.includes('honeymoon') || lower.includes('romantic')) {
                reply = "How romantic! 💕 Here are our top **honeymoon picks**:\n\n1. 🏔️ **Kashmir** - 7D/6N from ₹32,999/couple\n2. 🌿 **Kerala** - 6D/5N from ₹28,999/couple\n3. 🏖️ **Andaman** - 6D/5N from ₹44,999/couple\n4. 🏰 **Rajasthan** - 8D/7N from ₹39,999/couple\n\nAll honeymoon packages include special romantic setups, candle-lit dinners, and couple massages! Want details on any?";
            } else if (lower.includes('ladakh') || lower.includes('leh')) {
                reply = "**Ladakh** is absolutely epic! 🏔️✨\n\nOur **Ladakh Adventure Circuit** (9 Days) starts at ₹29,999/person:\n- Pangong Lake overnight camp\n- Nubra Valley & camel ride\n- Khardung La (world's highest road)\n- All permits included\n\n⚠️ Best time to visit: **May to September**\n\n[View full Ladakh itinerary](/destinations/ladakh)";
            } else if (lower.includes('book') || lower.includes('price') || lower.includes('cost')) {
                reply = "I'd love to help you book! 🎉\n\nTo give you an exact quote, I need:\n1. 📍 Which destination?\n2. 👥 How many travelers?\n3. 📅 Travel dates?\n4. 🏨 Budget range?\n\nYou can also:\n- [Browse all destinations](/destinations)\n- [Start booking directly](/booking)\n- 📞 Call us: **+91 98765 43210**";
            } else if (lower.includes('weather') || lower.includes('best time') || lower.includes('when')) {
                reply = "Here's the **best time to visit** popular destinations:\n\n🏔️ **Kashmir:** April–October\n🏖️ **Goa:** November–February\n🌿 **Kerala:** September–March\n🏰 **Rajasthan:** October–March\n🏔️ **Ladakh:** May–September\n🏝️ **Andaman:** October–May\n⛰️ **Manali:** March–June, Sept–Nov\n\nWhich destination are you considering?";
            } else {
                reply = "That's a great question! 😊 I'm here to help you plan the perfect Indian vacation.\n\nI can help with:\n- 🗺️ Destination recommendations\n- ✈️ Package customization\n- 💰 Budget planning\n- 📅 Itinerary creation\n\nOr you can [browse all destinations](/destinations) or [call us at +91 98765 43210](tel:+919876543210) for instant help!";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

    const formatMessage = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-500 underline hover:text-brand-600 font-medium" onclick="window.location.href=\'$2\'">$1</a>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence mode="wait">
                {!isOpen && (
                    <motion.div key="button" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                        <motion.button
                            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                            className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-brand hover:bg-brand-600 transition-colors relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageSquare className="w-6 h-6" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-card border border-gray-100 px-4 py-2 whitespace-nowrap text-sm font-medium text-night-900"
                        >
                            💬 Chat with Aria AI
                            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100" />
                        </motion.div>
                    </motion.div>
                )}

                {isOpen && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1, height: isMinimized ? 'auto' : '560px' }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-night-900 to-night-800 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm relative">
                                    <Sparkles className="w-4 h-4" />
                                    <motion.div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-night-900"
                                        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Aria — GoTravel AI</h3>
                                    <p className="text-[10px] text-white/70">Your personal travel planner · Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <a href="tel:+919876543210" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Call us">
                                    <PhoneCall className="w-4 h-4" />
                                </a>
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'assistant' && (
                                                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center mr-2 mt-1 shrink-0">
                                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                                ? 'bg-brand-500 text-white rounded-br-sm'
                                                : 'bg-white text-night-900 border border-gray-100 rounded-bl-sm shadow-sm'}`}>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                                    className="leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center mr-2 shrink-0">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div key={i} className="w-2 h-2 bg-brand-400 rounded-full"
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Replies */}
                                    {showQuickReplies && messages.length === 1 && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-400 text-center">Quick questions:</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {QUICK_REPLIES.map((qr, i) => (
                                                    <motion.button key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                                        onClick={() => sendMessage(qr)}
                                                        className="text-xs bg-white border border-brand-200 text-brand-600 rounded-full px-3 py-1.5 hover:bg-brand-50 transition-colors">
                                                        {qr}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                                    <form onSubmit={handleSend} className="flex items-center gap-2">
                                        <input
                                            type="text" value={input} onChange={e => setInput(e.target.value)}
                                            placeholder="Ask about destinations, packages..."
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                                            disabled={loading}
                                        />
                                        <motion.button type="submit" disabled={!input.trim() || loading}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-brand-600 transition-colors">
                                            <Send className="w-4 h-4 translate-x-px" />
                                        </motion.button>
                                    </form>
                                    <p className="text-[10px] text-gray-400 text-center mt-1.5">
                                        Powered by AI · <Link href="/contact" className="text-brand-500 hover:underline">Talk to a human</Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
