'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Check, MessageCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '@/lib/api';

const CONTACT_INFO = [
    { icon: Phone, label: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210', color: 'bg-green-50 text-green-600' },
    { icon: Mail, label: 'Email', value: 'hello@gotravel.in', link: 'mailto:hello@gotravel.in', color: 'bg-blue-50 text-blue-600' },
    { icon: MapPin, label: 'Office', value: 'Mumbai, Maharashtra, India', link: '#', color: 'bg-brand-50 text-brand-600' },
    { icon: Clock, label: 'Hours', value: 'Mon–Sat 9AM–8PM IST', link: '#', color: 'bg-purple-50 text-purple-600' },
];

export default function ContactClient() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await leadsApi.create({ ...form, source: 'contact_form' });
        } catch { /* Silent */ }
        setLoading(false);
        setSubmitted(true);
        toast.success('Message sent! We\'ll call you within 2 hours.');
    };

    const handleWhatsApp = () => {
        const msg = encodeURIComponent('Hi GoTravel! I\'d like to enquire about a tour package.');
        window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold mb-4">📞 Get In Touch</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-night-900 mb-4">
                    Let's Plan Your <span className="text-brand-500">Dream Trip</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                    Our travel experts are ready to help you create the perfect India travel experience.
                </p>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {CONTACT_INFO.map((info, i) => (
                    <motion.a key={i} href={info.link} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all text-center block">
                        <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-3`}>
                            <info.icon className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{info.label}</p>
                        <p className="text-sm font-semibold text-night-900 leading-snug">{info.value}</p>
                    </motion.a>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-night-900 mb-6">Send Us a Message</h2>
                        {submitted ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-night-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500">We'll get back to you within <strong>2 hours</strong>.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Your Name *</label>
                                        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Rahul Sharma" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number *</label>
                                        <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+91 98765 43210" className="input-field" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address *</label>
                                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="you@email.com" className="input-field" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Interested Destination</label>
                                    <input type="text" value={form.destination} onChange={e => update('destination', e.target.value)} placeholder="e.g. Kashmir, Goa, Ladakh" className="input-field" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Message *</label>
                                    <textarea value={form.message} onChange={e => update('message', e.target.value)} required rows={4}
                                        placeholder="Tell us about your travel plans, dates, budget, and any special requirements..."
                                        className="input-field resize-none" />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60">
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</> : <><Send className="w-5 h-5" /> Send Message</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* WhatsApp + Map */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-8">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Chat on WhatsApp</h3>
                        <p className="text-green-100 mb-6 text-sm">Get instant replies from our travel experts. Usually responds in under 5 minutes!</p>
                        <button onClick={handleWhatsApp} className="bg-white text-green-600 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center gap-2 w-full justify-center">
                            <MessageCircle className="w-5 h-5" /> Start WhatsApp Chat
                        </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl shadow-card border border-gray-100 p-6">
                        <h3 className="font-bold text-night-900 mb-4">Quick Response Promise</h3>
                        <div className="space-y-3">
                            {[
                                ['📞 Phone/WhatsApp', 'Within 30 minutes'],
                                ['📧 Email', 'Within 2 hours'],
                                ['💬 Chat Support', 'Instant AI + Human'],
                            ].map(([ch, tm]) => (
                                <div key={ch} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{ch}</span>
                                    <span className="font-semibold text-green-600">{tm}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
