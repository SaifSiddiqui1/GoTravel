'use client';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Users, MapPin, Star, Shield } from 'lucide-react';

const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Happy Travelers', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: MapPin, value: 150, suffix: '+', label: 'Destinations Covered', color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: Star, value: 4.8, suffix: '/5', label: 'Average Rating', decimals: 1, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: Shield, value: 10, suffix: 'yr', label: 'Years of Experience', color: 'text-green-500', bg: 'bg-green-50' },
];

export default function StatsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <section ref={ref} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="relative bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-50 text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div className={`text-3xl font-bold font-display ${stat.color} mb-1`}>
                                {inView ? (
                                    <CountUp end={stat.value} duration={2.5} decimals={stat.decimals || 0} suffix={stat.suffix} />
                                ) : '0'}
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
