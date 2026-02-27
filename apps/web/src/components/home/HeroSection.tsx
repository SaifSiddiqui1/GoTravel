'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const heroImages = [
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop',
];

const popularDestinations = ['Kashmir', 'Manali', 'Goa', 'Kerala', 'Rajasthan', 'Ladakh'];

export default function HeroSection() {
    const router = useRouter();
    const [bgIndex, setBgIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [travelers, setTravelers] = useState('2');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            router.push(`/destinations?search=${encodeURIComponent(searchQuery)}&travelers=${travelers}`);
        } else {
            router.push('/destinations');
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {heroImages.map((img, i) => (
                    <motion.div
                        key={img}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                        animate={{ opacity: i === bgIndex ? 1 : 0 }}
                        transition={{ duration: 1.5 }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setBgIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === bgIndex ? 'w-8 bg-brand-500' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Trusted by 50,000+ Happy Travelers Across India
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
                        Explore{' '}
                        <span className="relative">
                            <span className="text-brand-400">Incredible</span>
                            <motion.div
                                className="absolute -bottom-2 left-0 h-1 bg-brand-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 1, duration: 0.6 }}
                            />
                        </span>
                        <br />India With Us
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Customized travel experiences crafted just for you. Group tours, FIT packages,
                        and honeymoon specials with expert guides and free ₹4.5L travel insurance.
                    </p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 max-w-3xl mx-auto"
                >
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Where do you want to go?"
                                className="flex-1 bg-transparent text-night-900 placeholder:text-gray-400 outline-none text-sm font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 min-w-[140px]">
                            <Users className="w-5 h-5 text-brand-500 flex-shrink-0" />
                            <select
                                value={travelers}
                                onChange={(e) => setTravelers(e.target.value)}
                                className="bg-transparent text-night-900 outline-none text-sm font-medium flex-1"
                            >
                                {['1', '2', '3', '4', '5', '6', '8', '10', '15', '20+'].map(n => (
                                    <option key={n} value={n}>{n} {n === '1' ? 'Traveler' : 'Travelers'}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary px-8 py-3 text-base rounded-2xl">
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </form>
                    {/* Quick suggestions */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
                        <span className="text-xs text-gray-400 font-medium">Popular:</span>
                        {popularDestinations.map((dest) => (
                            <button
                                key={dest}
                                onClick={() => setSearchQuery(dest)}
                                className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors font-medium"
                            >
                                {dest}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="mt-16 flex flex-col items-center gap-2 text-white/50"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </div>
        </section>
    );
}
