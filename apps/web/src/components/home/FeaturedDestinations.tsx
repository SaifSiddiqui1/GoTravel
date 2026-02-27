'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import { destinationsApi } from '@/lib/api';
import { MOCK_DESTINATIONS } from '@/lib/mockData';

function DestinationCard({ dest, index }: { dest: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer"
        >
            <div className="relative h-72 overflow-hidden">
                <Image
                    src={dest.heroImage}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {dest.isFeatured && (
                        <span className="badge bg-brand-500 text-white text-xs"><TrendingUp className="w-3 h-3" /> Featured</span>
                    )}
                    <span className="badge bg-white/20 backdrop-blur-sm text-white text-xs capitalize">{dest.difficulty}</span>
                </div>

                {/* Price */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-right">
                    <p className="text-white/70 text-xs">Starting from</p>
                    <p className="text-white font-bold text-lg">₹{dest.basePrice?.toLocaleString('en-IN')}</p>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-white/70 text-sm mb-3 flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.state}, India</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-white font-medium text-sm">{dest.rating?.toFixed(1)}</span>
                                <span className="text-white/60 text-xs">({dest.reviewCount?.toLocaleString()})</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/70 text-sm">
                                <Clock className="w-4 h-4" />
                                {dest.duration} Days
                            </div>
                        </div>
                        <Link
                            href={`/destinations/${dest.slug}`}
                            className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors flex items-center gap-1"
                        >
                            Explore <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const tags = ['All', 'Mountains', 'Beach', 'Heritage', 'Adventure', 'Honeymoon', 'Family'];

export default function FeaturedDestinations() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('All');

    useEffect(() => {
        destinationsApi.featured()
            .then(res => setDestinations(res.data.data || []))
            .catch(() => {
                // Fallback to mock data when API is not available
                setDestinations(MOCK_DESTINATIONS.filter(d => d.isFeatured));
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeTag === 'All'
        ? destinations
        : destinations.filter(d => d.tags?.some((t: string) => t.toLowerCase() === activeTag.toLowerCase()));

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="inline-block px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold mb-4">🗺️ Top Destinations</span>
                        <h2 className="section-title mb-4">Explore India's Finest <span className="text-brand-500">Destinations</span></h2>
                        <p className="section-subtitle max-w-2xl mx-auto">From snow-capped Himalayan peaks to golden Goan beaches — every destination is a new story waiting to be written.</p>
                    </motion.div>
                </div>

                {/* Filter tags */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTag === tag
                                ? 'bg-brand-500 text-white shadow-brand'
                                : 'bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 border border-gray-200'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-72 rounded-3xl skeleton" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No destinations found for "{activeTag}"</p>
                        <button onClick={() => setActiveTag('All')} className="mt-4 text-brand-500 font-semibold hover:underline">Clear filter</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((dest, i) => (
                            <DestinationCard key={dest._id} dest={dest} index={i} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/destinations" className="btn-secondary text-base px-8 py-4">
                        View All Destinations <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
