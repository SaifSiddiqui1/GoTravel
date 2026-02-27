'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Clock, MapPin, Check, X, ChevronDown, ChevronUp,
    Sparkles, Plus, Minus, Calendar, Users, ArrowRight,
    Camera, CloudSun, Thermometer, Phone, MessageCircle
} from 'lucide-react';
import { aiApi } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Gallery Modal ────────────────────────────────────────────
function GalleryModal({ images, onClose, startIndex = 0 }: { images: string[]; onClose: () => void; startIndex?: number }) {
    const [current, setCurrent] = useState(startIndex);
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-brand-500 transition-colors">
                    <X className="w-8 h-8" />
                </button>
                <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden">
                    <Image src={images[current]} alt="" fill className="object-cover" />
                </div>
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-brand-500 w-6' : 'bg-white/40'}`} />
                    ))}
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button onClick={() => setCurrent(p => Math.max(0, p - 1))} className="p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors">
                        ‹
                    </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button onClick={() => setCurrent(p => Math.min(images.length - 1, p + 1))} className="p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors">
                        ›
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── AI Itinerary Generator ────────────────────────────────────
function AIItineraryGenerator({ destination }: { destination: any }) {
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState<any[]>([]);
    const [prefs, setPrefs] = useState({ days: destination.duration, travelers: 2, style: 'balanced', budget: 'mid' });
    const [expanded, setExpanded] = useState(false);

    const generateItinerary = async () => {
        setLoading(true);
        try {
            const res = await aiApi.generateItinerary({
                destination: destination.name,
                state: destination.state,
                days: prefs.days,
                travelers: prefs.travelers,
                style: prefs.style,
                budget: prefs.budget,
                highlights: destination.highlights,
            });
            const generated = res.data.data?.itinerary || destination.itinerary;
            setItinerary(generated);
            setExpanded(true);
        } catch {
            // Fallback to mock itinerary
            setItinerary(destination.itinerary);
            setExpanded(true);
            toast.success('Showing curated itinerary for ' + destination.name);
        } finally {
            setLoading(false);
        }
    };

    const displayItinerary = itinerary.length > 0 ? itinerary : destination.itinerary;

    return (
        <div className="bg-gradient-to-br from-night-900 to-night-800 rounded-3xl p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">AI Itinerary Planner</h3>
                    <p className="text-white/60 text-sm">Personalized day-by-day plan for {destination.name}</p>
                </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="text-white/60 text-xs mb-1 block">Duration</label>
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                        <button onClick={() => setPrefs(p => ({ ...p, days: Math.max(2, p.days - 1) }))} className="text-white/60 hover:text-white"><Minus className="w-3 h-3" /></button>
                        <span className="flex-1 text-center text-sm font-medium">{prefs.days}D</span>
                        <button onClick={() => setPrefs(p => ({ ...p, days: Math.min(21, p.days + 1) }))} className="text-white/60 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                </div>
                <div>
                    <label className="text-white/60 text-xs mb-1 block">Travelers</label>
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                        <button onClick={() => setPrefs(p => ({ ...p, travelers: Math.max(1, p.travelers - 1) }))} className="text-white/60 hover:text-white"><Minus className="w-3 h-3" /></button>
                        <span className="flex-1 text-center text-sm font-medium">{prefs.travelers}</span>
                        <button onClick={() => setPrefs(p => ({ ...p, travelers: Math.min(20, p.travelers + 1) }))} className="text-white/60 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                </div>
                <div>
                    <label className="text-white/60 text-xs mb-1 block">Style</label>
                    <select value={prefs.style} onChange={e => setPrefs(p => ({ ...p, style: e.target.value }))}
                        className="w-full bg-white/10 text-white rounded-xl px-3 py-2 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-brand-500">
                        <option value="relaxed" className="text-gray-900">Relaxed</option>
                        <option value="balanced" className="text-gray-900">Balanced</option>
                        <option value="adventure" className="text-gray-900">Adventure</option>
                    </select>
                </div>
                <div>
                    <label className="text-white/60 text-xs mb-1 block">Budget</label>
                    <select value={prefs.budget} onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))}
                        className="w-full bg-white/10 text-white rounded-xl px-3 py-2 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-brand-500">
                        <option value="budget" className="text-gray-900">Budget</option>
                        <option value="mid" className="text-gray-900">Mid-range</option>
                        <option value="luxury" className="text-gray-900">Luxury</option>
                    </select>
                </div>
            </div>

            <button
                onClick={generateItinerary}
                disabled={loading}
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-2xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
                {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating your perfect plan…</>
                ) : (
                    <><Sparkles className="w-4 h-4" />Generate AI Itinerary</>
                )}
            </button>

            {/* Itinerary Display */}
            {displayItinerary.length > 0 && (
                <div className="mt-6">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center justify-between w-full text-left mb-4"
                    >
                        <h4 className="font-semibold">Day-by-Day Plan ({displayItinerary.length} Days)</h4>
                        {expanded ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                                {displayItinerary.map((day: any, i: number) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-xs font-bold shrink-0">
                                                {day.day || i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-sm mb-1">{day.title}</h5>
                                                <p className="text-white/60 text-xs leading-relaxed">{day.description}</p>
                                                {day.activities && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {day.activities.map((act: string, j: number) => (
                                                            <span key={j} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/80">{act}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

// ─── FIT Add-On Builder ───────────────────────────────────────
function FITBuilder({ destination, basePrice }: { destination: any; basePrice: number }) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [travelers, setTravelers] = useState(2);

    const totalAddOns = destination.fitAddOns
        .filter((a: any) => selected.has(a.id))
        .reduce((sum: number, a: any) => sum + a.price, 0);
    const totalPrice = (basePrice + totalAddOns) * travelers;

    const toggle = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
            <h3 className="text-xl font-bold text-night-900 mb-2">Build Your FIT Package</h3>
            <p className="text-gray-500 text-sm mb-6">Customize exactly what you want. Add activities to your itinerary.</p>

            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                <div>
                    <p className="text-sm text-gray-500">Number of Travelers</p>
                    <p className="font-semibold text-night-900">{travelers} person{travelers > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setTravelers(t => Math.max(1, t - 1))}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-colors">
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg w-6 text-center">{travelers}</span>
                    <button onClick={() => setTravelers(t => Math.min(20, t + 1))}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {destination.fitAddOns.map((addon: any) => (
                    <motion.div key={addon.id} whileTap={{ scale: 0.99 }}
                        onClick={() => toggle(addon.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selected.has(addon.id) ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm text-night-900">{addon.name}</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{addon.duration}</span>
                                </div>
                                <p className="text-xs text-gray-500">{addon.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="font-bold text-brand-500">+₹{addon.price.toLocaleString('en-IN')}</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected.has(addon.id) ? 'bg-brand-500 border-brand-500' : 'border-gray-300'}`}>
                                    {selected.has(addon.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-night-900 text-white rounded-2xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Base package × {travelers}</span>
                    <span>₹{(basePrice * travelers).toLocaleString('en-IN')}</span>
                </div>
                {selected.size > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/60">Add-ons × {travelers}</span>
                        <span>₹{(totalAddOns * travelers).toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-brand-400 text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <Link
                href={`/booking?destination=${destination.slug}&travelers=${travelers}&addons=${Array.from(selected).join(',')}&total=${totalPrice}`}
                className="btn-primary w-full justify-center text-base py-4"
            >
                Book Now — ₹{totalPrice.toLocaleString('en-IN')} <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" />Free Cancellation</span>
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" />No Hidden Charges</span>
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" />24/7 Support</span>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────
export default function DestinationDetailClient({ destination }: { destination: any }) {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'fit' | 'reviews'>('overview');

    const allImages = [destination.heroImage, ...(destination.gallery || [])];

    const handleWhatsApp = () => {
        const msg = encodeURIComponent(`Hi! I'm interested in the ${destination.name} package (${destination.duration} days from ₹${destination.basePrice.toLocaleString('en-IN')}). Please send me details.`);
        window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative h-[60vh] min-h-[400px]">
                <Image src={destination.heroImage} alt={destination.name} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <nav className="text-white/70 text-sm mb-4">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">{destination.name}</span>
                    </nav>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">{destination.name}</h1>
                    <p className="text-white/80 text-lg md:text-xl flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-brand-500" />
                        {destination.state}, India
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {destination.rating} ({destination.reviewCount?.toLocaleString()} reviews)
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm">
                            <Clock className="w-4 h-4" /> {destination.duration} Days
                        </div>
                        <div className="bg-brand-500 px-4 py-1.5 rounded-full text-white text-sm font-semibold">
                            From ₹{destination.basePrice?.toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>

                {/* Gallery button */}
                <button
                    onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
                    className="absolute top-6 right-6 bg-white/20 backdrop-blur border border-white/20 text-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/30 transition-colors"
                >
                    <Camera className="w-4 h-4" />
                    View Gallery ({allImages.length})
                </button>
            </div>

            {/* Tab Nav */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 overflow-x-auto">
                        {(['overview', 'itinerary', 'fit', 'reviews'] as const).map((tab) => (
                            <button key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {tab === 'fit' ? 'FIT Builder' : tab === 'itinerary' ? 'Itinerary' : tab === 'reviews' ? 'Reviews' : 'Overview'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {activeTab === 'overview' && (
                            <>
                                {/* Description */}
                                <div>
                                    <h2 className="text-2xl font-bold text-night-900 mb-4">About {destination.name}</h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">{destination.description}</p>
                                </div>

                                {/* Highlights */}
                                <div>
                                    <h3 className="text-xl font-bold text-night-900 mb-4">Top Highlights</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {destination.highlights?.map((h: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-green-800">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Inclusions & Exclusions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-night-900 mb-3 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                            What's Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {destination.inclusions?.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-night-900 mb-3 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"><X className="w-3 h-3 text-white" /></div>
                                            Not Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {destination.exclusions?.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Weather */}
                                <div className="bg-blue-50 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-night-900 mb-4 flex items-center gap-2">
                                        <CloudSun className="w-5 h-5 text-blue-500" /> Best Time & Weather
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        <span className="font-semibold text-night-900">Best time to visit:</span> {destination.bestTimeToVisit}
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {Object.entries(destination.weather || {}).map(([season, temp]) => (
                                            <div key={season} className="text-center">
                                                <div className="text-xs text-gray-500 capitalize mb-1">{season}</div>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Thermometer className="w-3 h-3 text-blue-500" />
                                                    <span className="text-sm font-semibold text-night-900">{temp as string}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Photo Gallery Strip */}
                                {destination.gallery?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-night-900 mb-4">Photo Gallery</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {allImages.slice(0, 6).map((img: string, i: number) => (
                                                <div key={i} className="relative h-32 rounded-xl overflow-hidden cursor-pointer group"
                                                    onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}>
                                                    <Image src={img} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                                    {i === 5 && allImages.length > 6 && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                            <span className="text-white font-bold">+{allImages.length - 6}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* FAQs */}
                                {destination.faqs?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-night-900 mb-4">Frequently Asked Questions</h3>
                                        <div className="space-y-3">
                                            {destination.faqs.map((faq: any, i: number) => (
                                                <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden">
                                                    <button
                                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                        className="w-full flex items-center justify-between p-5 text-left"
                                                    >
                                                        <span className="font-semibold text-night-900 text-sm">{faq.q}</span>
                                                        {openFaq === i ? <ChevronUp className="w-5 h-5 text-brand-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                    </button>
                                                    <AnimatePresence>
                                                        {openFaq === i && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'itinerary' && (
                            <AIItineraryGenerator destination={destination} />
                        )}

                        {activeTab === 'fit' && (
                            <FITBuilder destination={destination} basePrice={destination.basePrice} />
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-5xl font-bold text-night-900">{destination.rating}</div>
                                    <div>
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(destination.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-sm">{destination.reviewCount?.toLocaleString()} reviews</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Absolutely breathtaking! Every detail was perfect. The guides were knowledgeable and friendly.', date: '2 weeks ago' },
                                        { name: 'Rahul Mehta', city: 'Mumbai', rating: 5, text: `One of the best trips of my life to ${destination.name}. GoTravel made it completely hassle-free.`, date: '1 month ago' },
                                        { name: 'Anjali Singh', city: 'Bangalore', rating: 4, text: 'Great experience overall. The package was value for money and the accommodations were excellent.', date: '1 month ago' },
                                        { name: 'Vikram Patel', city: 'Pune', rating: 5, text: 'Highly recommend! The AI itinerary planner helped us customize the perfect trip.', date: '2 months ago' },
                                    ].map((review, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {review.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-night-900">{review.name}</p>
                                                        <p className="text-xs text-gray-500">{review.city} · {review.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(review.rating)].map((_, j) => (
                                                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Book Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 sticky top-24">
                            <div className="text-center mb-4">
                                <p className="text-gray-500 text-sm">Starting from</p>
                                <p className="text-4xl font-bold text-brand-500">₹{destination.basePrice?.toLocaleString('en-IN')}</p>
                                <p className="text-gray-500 text-sm">per person</p>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Duration</span>
                                    <span className="font-semibold text-night-900">{destination.duration} Days</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> Best Time</span>
                                    <span className="font-semibold text-night-900">{destination.bestTimeToVisit?.split(' ')[0]} – {destination.bestTimeToVisit?.split(' – ')[1]?.split('')[0]}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1"><Users className="w-4 h-4" /> Group Size</span>
                                    <span className="font-semibold text-night-900">1–20 people</span>
                                </div>
                            </div>
                            <Link href={`/booking?destination=${destination.slug}`} className="btn-primary w-full justify-center py-4 text-base mb-3">
                                Book This Package <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button onClick={handleWhatsApp}
                                className="w-full py-3 bg-green-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                                <MessageCircle className="w-5 h-5" /> WhatsApp Enquiry
                            </button>
                            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-4 hover:text-brand-500 transition-colors">
                                <Phone className="w-4 h-4" /> +91 98765 43210
                            </a>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-4">
                            <h4 className="text-sm font-semibold text-night-900 mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {destination.tags?.map((tag: string) => (
                                    <Link key={tag} href={`/destinations?tag=${tag}`}
                                        className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-medium hover:bg-brand-100 transition-colors">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {galleryOpen && (
                    <GalleryModal images={allImages} onClose={() => setGalleryOpen(false)} startIndex={galleryIndex} />
                )}
            </AnimatePresence>
        </div>
    );
}
