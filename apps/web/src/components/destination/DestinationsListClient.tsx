'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Star, Clock, MapPin, Filter, ArrowRight, TrendingUp } from 'lucide-react';
import { MOCK_DESTINATIONS } from '@/lib/mockData';

const CATEGORIES = ['All', 'Mountains', 'Beach', 'Heritage', 'Adventure', 'Honeymoon', 'Family'];
const PRICE_RANGES = [
    { label: 'Under ₹15K', min: 0, max: 15000 },
    { label: '₹15K–₹25K', min: 15000, max: 25000 },
    { label: '₹25K–₹40K', min: 25000, max: 40000 },
    { label: '₹40K+', min: 40000, max: Infinity },
];

export default function DestinationsListClient({ initialFilters }: { initialFilters?: Record<string, string> }) {
    const [search, setSearch] = useState(initialFilters?.q || '');
    const [activeCategory, setActiveCategory] = useState(initialFilters?.tag || 'All');
    const [priceRange, setPriceRange] = useState<null | { min: number; max: number }>(null);
    const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
    const [showFilters, setShowFilters] = useState(false);

    const destinations = useMemo(() => {
        let list = [...MOCK_DESTINATIONS];
        if (search) list = list.filter(d =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.state.toLowerCase().includes(search.toLowerCase())
        );
        if (activeCategory !== 'All') list = list.filter(d => d.tags?.includes(activeCategory));
        if (priceRange) list = list.filter(d => d.basePrice >= priceRange.min && d.basePrice <= priceRange.max);
        switch (sortBy) {
            case 'price_asc': return list.sort((a, b) => a.basePrice - b.basePrice);
            case 'price_desc': return list.sort((a, b) => b.basePrice - a.basePrice);
            case 'rating': return list.sort((a, b) => b.rating - a.rating);
            default: return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
    }, [search, activeCategory, priceRange, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-night-900 mb-2">
                    Explore <span className="text-brand-500">India's Destinations</span>
                </h1>
                <p className="text-gray-500">Discover {MOCK_DESTINATIONS.length}+ incredible destinations handpicked by our travel experts</p>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search destinations, states..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white text-sm"
                    >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${showFilters ? 'border-brand-500 text-brand-500 bg-brand-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>

                {showFilters && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Price Range</p>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setPriceRange(null)}
                                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${!priceRange ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                                All Prices
                            </button>
                            {PRICE_RANGES.map(r => (
                                <button key={r.label} onClick={() => setPriceRange({ min: r.min, max: r.max })}
                                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${priceRange?.min === r.min ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-brand-500 text-white shadow-brand' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50 hover:text-brand-600'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">{destinations.length} destination{destinations.length !== 1 ? 's' : ''} found</p>

            {/* Grid */}
            {destinations.length === 0 ? (
                <div className="text-center py-24">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold text-night-900 mb-2">No destinations found</h3>
                    <p className="text-gray-500 mb-6">Try a different search or remove filters</p>
                    <button onClick={() => { setSearch(''); setActiveCategory('All'); setPriceRange(null); }}
                        className="btn-primary">Clear All Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest, i) => (
                        <motion.div key={dest._id}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="group rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-500">
                            <div className="relative h-60">
                                <Image src={dest.heroImage} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                {dest.isFeatured && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                                        <TrendingUp className="w-3 h-3" /> Featured
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-right">
                                    <p className="text-white/70 text-[10px]">From</p>
                                    <p className="text-white font-bold text-sm">₹{dest.basePrice.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <h3 className="font-display text-xl font-bold text-white">{dest.name}</h3>
                                    <p className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.state}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{dest.shortDescription}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{dest.rating}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{dest.duration}D</span>
                                    </div>
                                    <Link href={`/destinations/${dest.slug}`}
                                        className="flex items-center gap-1 bg-brand-500 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                                        View <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
