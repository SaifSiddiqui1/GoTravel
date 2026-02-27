'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Phone, Mail, MessageSquare, Check, Loader2, ArrowRight } from 'lucide-react';
import { MOCK_DESTINATIONS } from '@/lib/mockData';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { leadsApi } from '@/lib/api';

export default function BookingClient({ initialData }: { initialData?: Record<string, string> }) {
    const selectedDest = MOCK_DESTINATIONS.find(d => d.slug === initialData?.destination) || MOCK_DESTINATIONS[0];
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        destination: initialData?.destination || '',
        travelers: parseInt(initialData?.travelers || '2'),
        travelDate: '',
        duration: selectedDest.duration,
        name: '',
        email: '',
        phone: '',
        message: '',
        budget: 'mid',
        travelType: 'couple',
    });

    const price = MOCK_DESTINATIONS.find(d => d.slug === form.destination)?.basePrice || selectedDest.basePrice;
    const total = price * form.travelers;

    const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await leadsApi.create({
                name: form.name,
                email: form.email,
                phone: form.phone,
                destination: form.destination || selectedDest.name,
                travelers: form.travelers,
                travelDate: form.travelDate,
                budget: total,
                message: form.message,
                source: 'booking_form',
            });
        } catch {
            // Submit silently — API may not be connected yet
        }
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center bg-white rounded-3xl shadow-card p-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-night-900 mb-3">Booking Request Sent! 🎉</h2>
                    <p className="text-gray-500 mb-2">Thank you, <strong className="text-night-900">{form.name}</strong>!</p>
                    <p className="text-gray-500 mb-6 text-sm">Our travel expert will call you within <strong>2 hours</strong> at <strong>{form.phone}</strong> to confirm your booking and provide a detailed quote.</p>
                    <div className="bg-brand-50 rounded-2xl p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-night-900 mb-1">Booking Summary</p>
                        <p className="text-sm text-gray-600">{form.destination || selectedDest.name} • {form.travelers} travelers • ₹{total.toLocaleString('en-IN')}</p>
                    </div>
                    <a href="/" className="btn-primary justify-center w-full">Back to Home</a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-night-900 mb-2">
                    Book Your <span className="text-brand-500">Dream Trip</span>
                </h1>
                <p className="text-gray-500">Fill in your details and our expert will contact you within 2 hours</p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto">
                {['Choose Destination', 'Travel Details', 'Your Information'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-sm font-medium whitespace-nowrap ${step === i + 1 ? 'text-night-900' : 'text-gray-400'}`}>{s}</span>
                        {i < 2 && <div className={`h-px w-6 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2">
                    {/* Step 1: Destination */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
                            <h2 className="text-xl font-bold text-night-900 mb-6">Choose Your Destination</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {MOCK_DESTINATIONS.map(dest => (
                                    <div key={dest._id}
                                        onClick={() => update('destination', dest.slug)}
                                        className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${form.destination === dest.slug ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent hover:border-gray-300'}`}>
                                        <div className="relative h-32">
                                            <Image src={dest.heroImage} alt={dest.name} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            {form.destination === dest.slug && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 left-3">
                                                <p className="text-white font-semibold text-sm">{dest.name}</p>
                                                <p className="text-white/70 text-xs">From ₹{dest.basePrice.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => setStep(2)} disabled={!form.destination}
                                className="btn-primary w-full mt-6 justify-center py-4 disabled:opacity-50">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Travel Details */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 space-y-5">
                            <h2 className="text-xl font-bold text-night-900">Travel Details</h2>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Travel Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="date" value={form.travelDate} onChange={e => update('travelDate', e.target.value)} required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input-field pl-12" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Number of Travelers</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select value={form.travelers} onChange={e => update('travelers', parseInt(e.target.value))} className="input-field pl-12">
                                        {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map(n => (
                                            <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Travel Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {['solo', 'couple', 'family', 'group'].map(t => (
                                        <button key={t} type="button" onClick={() => update('travelType', t)}
                                            className={`py-2.5 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${form.travelType === t ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            {t === 'solo' ? '👤 Solo' : t === 'couple' ? '💑 Couple' : t === 'family' ? '👨‍👩‍👧 Family' : '👥 Group'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Budget Preference</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[['budget', '💰 Budget', 'Under ₹15K/pax'], ['mid', '🏨 Mid-Range', '₹15K–₹35K/pax'], ['luxury', '💎 Luxury', 'Above ₹35K/pax']].map(([val, label, sub]) => (
                                        <button key={val} type="button" onClick={() => update('budget', val)}
                                            className={`py-3 px-3 rounded-xl border-2 text-xs leading-tight transition-all text-left ${form.budget === val ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="font-semibold text-night-900 mb-0.5">{label}</div>
                                            <div className="text-gray-500">{sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-4">Back</button>
                                <button type="button" onClick={() => { if (!form.travelDate) { toast.error('Please select travel date'); return; } setStep(3); }} className="btn-primary flex-1 justify-center py-4">
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Personal Info */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 space-y-5">
                            <h2 className="text-xl font-bold text-night-900">Your Information</h2>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
                                    placeholder="Your full name"
                                    className="input-field" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required
                                            placeholder="+91 98765 43210" className="input-field pl-12" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
                                            placeholder="you@email.com" className="input-field pl-12" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Special Requirements (optional)</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <textarea value={form.message} onChange={e => update('message', e.target.value)}
                                        rows={3} placeholder="Any special requests, dietary needs, or questions..."
                                        className="input-field pl-12 resize-none" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center py-4">Back</button>
                                <button type="submit" disabled={loading}
                                    className="btn-primary flex-1 justify-center py-4 disabled:opacity-60">
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</> : <>Confirm Booking Request <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </form>

                {/* Sidebar: Booking Summary */}
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
                        <h3 className="font-bold text-night-900 mb-4">Booking Summary</h3>
                        {form.destination ? (
                            (() => {
                                const dest = MOCK_DESTINATIONS.find(d => d.slug === form.destination)!;
                                return (
                                    <>
                                        <div className="relative h-32 rounded-2xl overflow-hidden mb-4">
                                            <Image src={dest.heroImage} alt={dest.name} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <p className="absolute bottom-3 left-3 font-bold text-white">{dest.name}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{dest.state}</span>
                                                <span className="text-night-900 font-medium">{dest.duration} Days</span>
                                            </div>
                                            {form.travelDate && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Travel Date</span>
                                                    <span className="text-night-900 font-medium">{new Date(form.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" />Travelers</span>
                                                <span className="text-night-900 font-medium">{form.travelers}</span>
                                            </div>
                                        </div>
                                        <div className="border-t mt-4 pt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">₹{dest.basePrice.toLocaleString('en-IN')} × {form.travelers}</span>
                                                <span>₹{total.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Est. Total</span>
                                                <span className="text-brand-500">₹{total.toLocaleString('en-IN')}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">* Final price confirmed after consultation</p>
                                        </div>
                                    </>
                                );
                            })()
                        ) : (
                            <p className="text-gray-400 text-sm">Select a destination to see your summary</p>
                        )}
                    </div>

                    {/* Trust Signals */}
                    <div className="bg-green-50 rounded-2xl p-4 space-y-2">
                        {['Free cancellation up to 30 days', 'No hidden payment charges', 'Expert human support 24/7', 'Instant WhatsApp confirmation'].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-green-700">
                                <Check className="w-4 h-4 text-green-500 shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
