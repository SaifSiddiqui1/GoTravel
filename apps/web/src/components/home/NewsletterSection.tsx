'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        toast.success('🎉 You\'re subscribed! Get ready for amazing travel deals.');
        setEmail('');
        setLoading(false);
    };

    return (
        <section className="py-20 bg-gradient-brand relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="font-display text-4xl font-bold text-white mb-4">Get Exclusive Travel Deals</h2>
                    <p className="text-white/80 text-lg mb-8">Subscribe to our newsletter and receive early-bird offers, seasonal discounts, and curated travel inspiration. Unsubscribe anytime.</p>
                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="flex-1 px-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 outline-none focus:border-white/60 transition-colors"
                        />
                        <button type="submit" disabled={loading} className="px-6 py-4 bg-white text-brand-600 rounded-2xl font-bold hover:bg-brand-50 transition-colors flex items-center gap-2 flex-shrink-0">
                            {loading ? '...' : <><ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>
                    <p className="text-white/60 text-sm mt-4">No spam. Unsubscribe anytime. 🔒 Your data is safe with us.</p>
                </motion.div>
            </div>
        </section>
    );
}
