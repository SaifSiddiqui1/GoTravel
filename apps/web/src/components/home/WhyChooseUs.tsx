'use client';
import { motion } from 'framer-motion';
import { Shield, HeartHandshake, Headphones, Award, Wallet, Users } from 'lucide-react';

const reasons = [
    { icon: Shield, title: 'Free ₹4.5L Insurance', desc: 'Every booking comes with complimentary travel insurance. Your safety is our priority.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Headphones, title: '24/7 Expert Support', desc: 'Our travel experts are available round the clock, before, during, and after your trip.', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Award, title: 'Award-Winning Agency', desc: 'Recognized as India\'s Top Travel Agency by Economic Times and Tourism Ministry of India.', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: HeartHandshake, title: 'Curated Experiences', desc: 'Every itinerary is handcrafted by our destination experts — no cookie-cutter packages.', color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: Wallet, title: 'Best Price Guarantee', desc: 'Found it cheaper elsewhere? We\'ll match the price. No questions asked.', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Users, title: 'Small Group Culture', desc: 'We cap group sizes to ensure personalized attention and authentic connections.', color: 'text-pink-500', bg: 'bg-pink-50' },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="inline-block px-4 py-2 rounded-full bg-night-900/5 text-night-900 text-sm font-semibold mb-4">🏆 Why GoTravel</span>
                        <h2 className="section-title mb-4">Why Thousands Choose <span className="text-brand-500">GoTravel</span></h2>
                        <p className="section-subtitle max-w-2xl mx-auto">We're not just a travel agency — we're your trusted travel companion, delivering unforgettable journeys since 2014.</p>
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((r, i) => (
                        <motion.div
                            key={r.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group p-6 rounded-3xl border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${r.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                <r.icon className={`w-7 h-7 ${r.color}`} />
                            </div>
                            <h3 className="font-semibold text-night-900 text-lg mb-2">{r.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
