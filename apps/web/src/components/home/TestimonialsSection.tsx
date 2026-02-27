'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', destination: 'Kashmir Trip', rating: 5, text: 'GoTravel made our Kashmir honeymoon absolutely magical! The FIT package let us customize everything. The shikara ride at sunset on Dal Lake was breathtaking. Will definitely book again!', avatar: 'P' },
    { name: 'Rahul Mehta', location: 'Delhi', destination: 'Ladakh Bike Trip', rating: 5, text: 'Best bike trip of my life! From Leh to Pangong Lake via Khardung La. The team\'s planning was flawless — permits, accommodation, bike support — everything sorted! Highly recommended.', avatar: 'R' },
    { name: 'Ananya Patel', location: 'Bangalore', destination: 'Kerala Backwaters', rating: 5, text: 'The Kerala houseboat experience was beyond our expectations. The FIT builder helped us add an Ayurvedic spa day which was the highlight of our trip. GoTravel team is super responsive!', avatar: 'A' },
    { name: 'Vikram Singh', location: 'Jaipur', destination: 'Goa Beach Trip', rating: 4, text: 'Great experience with GoTravel! The group tour to Goa was well-organized. Hotel quality was excellent. The WhatsApp support during the trip was very helpful. Booking Manali next!', avatar: 'V' },
    { name: 'Sneha Kapoor', location: 'Pune', destination: 'Manali Family Tour', rating: 5, text: 'Took our parents to Manali with GoTravel\'s family package. The team was incredibly thoughtful about the needs of elderly travelers. Rohtang Pass was unforgettable!', avatar: 'S' },
    { name: 'Arjun Nair', location: 'Chennai', destination: 'Rajasthan Heritage Tour', rating: 5, text: '8 days through Rajasthan — Jaipur, Jodhpur, Udaipur, Jaisalmer. The camel safari in Jaisalmer under a star-studded sky was life-changing. GoTravel nailed every detail!', avatar: 'A' },
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="inline-block px-4 py-2 rounded-full bg-yellow-50 text-yellow-600 text-sm font-semibold mb-4">⭐ Real Reviews</span>
                        <h2 className="section-title mb-4">Travelers <span className="text-brand-500">Love Us</span></h2>
                        <p className="section-subtitle max-w-2xl mx-auto">Don't take our word for it — hear from thousands of happy travelers who explored India with GoTravel.</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name + i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="card p-6 hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-night-900">{t.name}</h4>
                                    <p className="text-sm text-gray-400">{t.location} · {t.destination}</p>
                                </div>
                                <Quote className="w-6 h-6 text-brand-200 ml-auto flex-shrink-0" />
                            </div>
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
