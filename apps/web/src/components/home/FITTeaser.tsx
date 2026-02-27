'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shuffle, Plus, Sparkles, ArrowRight } from 'lucide-react';

const fitFeatures = [
    { icon: Shuffle, title: 'Your Pace, Your Itinerary', desc: 'Start with our expertly crafted base itinerary and customize every day to your preference.' },
    { icon: Plus, title: 'Add Activities Al-a-Carte', desc: 'Browse 50+ unique local experiences — adventure, food, culture, relaxation — and add what excites you.' },
    { icon: Sparkles, title: 'AI Builds It For You', desc: 'Let our Gemini AI suggest the perfect combination of activities based on your interests and travel style.' },
];

export default function FITTeaser() {
    return (
        <section className="py-24 bg-gradient-dark relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-brand-500/20 text-brand-400 text-sm font-semibold mb-6">🎒 FIT Packages</span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Build Your <span className="text-brand-400">Perfect Trip</span>,
                            <br />Your Way
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-8">
                            FIT stands for Flexible Independent Traveler. Start with our hand-crafted base itinerary, then add unique local experiences à-la-carte. Watch your days and cost update in real time as you build your dream trip.
                        </p>
                        <div className="space-y-5 mb-10">
                            {fitFeatures.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                                        <f.icon className="w-5 h-5 text-brand-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">{f.title}</h4>
                                        <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <Link href="/destinations?type=fit" className="btn-primary text-base px-8 py-4">
                            Explore FIT Packages <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* Right - Visual mockup of FIT builder */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass p-6 space-y-4"
                    >
                        <h3 className="text-white font-semibold text-lg border-b border-white/10 pb-4">🎒 Kashmir FIT Builder</h3>
                        {/* Base package */}
                        <div className="bg-white/5 rounded-2xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/70 text-sm">Base Package (6 Days)</span>
                                <span className="text-white font-bold">₹18,700</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-brand-500 rounded-full" />
                            </div>
                        </div>
                        {/* Add-ons */}
                        {[
                            { name: '🚡 Gondola Cable Car', price: '₹1,500', added: true },
                            { name: '❄️ Snow Skiing', price: '₹2,500', added: true },
                            { name: '🛶 Shikara Ride', price: '₹800', added: false },
                            { name: '🍽️ Wazwan Dinner', price: '₹1,200', added: false },
                        ].map((item) => (
                            <div key={item.name} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${item.added ? 'bg-brand-500/20 border-brand-500/40' : 'bg-white/5 border-white/10'}`}>
                                <span className="text-white text-sm">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/70 text-sm">{item.price}</span>
                                    <button className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${item.added ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/60 hover:bg-brand-500/40'}`}>
                                        {item.added ? '✓' : '+'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Total */}
                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <div>
                                <p className="text-white/60 text-sm">Total (2 travelers)</p>
                                <p className="text-2xl font-bold text-white font-display">₹42,000</p>
                            </div>
                            <button className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors">
                                Book Now →
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
