'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { bookingsApi, packagesApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Users, Calendar, User, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = ['Trip Summary', 'Traveler Details', 'Contact Info', 'Payment'];

declare global { interface Window { Razorpay: any; } }

export default function BookingPage({ params }: { params: { packageId: string } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const destinationId = searchParams.get('destination');
    const [currentStep, setCurrentStep] = useState(0);
    const [pkg, setPkg] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<any>(null);
    const [form, setForm] = useState({
        travelers: [{ name: '', age: '', gender: 'male', idProofType: 'aadhar', idProofNumber: '' }],
        travelDate: '',
        contact: { name: '', email: '', phone: '' },
        specialRequests: '',
        groupSize: 1,
    });

    useEffect(() => {
        if (params.packageId) {
            packagesApi.detail(params.packageId).then(res => setPkg(res.data.data)).catch(console.error);
        }
    }, [params.packageId]);

    const addTraveler = () => {
        setForm(p => ({
            ...p,
            travelers: [...p.travelers, { name: '', age: '', gender: 'male', idProofType: 'aadhar', idProofNumber: '' }],
            groupSize: p.groupSize + 1,
        }));
    };

    const updateTraveler = (i: number, field: string, value: string) => {
        setForm(p => {
            const travelers = [...p.travelers];
            travelers[i] = { ...travelers[i], [field]: value };
            return { ...p, travelers };
        });
    };

    const initPayment = async () => {
        setLoading(true);
        try {
            const res = await bookingsApi.create({
                packageId: params.packageId,
                destinationId,
                travelers: form.travelers.map(t => ({ ...t, age: Number(t.age) })),
                travelDate: form.travelDate,
                contactDetails: form.contact,
                specialRequests: form.specialRequests,
                fitAddOns: [],
            });
            const { booking: newBooking, razorpayOrder, razorpayKeyId } = res.data.data;
            setBooking(newBooking);

            // Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            document.body.appendChild(script);
            script.onload = () => {
                const rzp = new window.Razorpay({
                    key: razorpayKeyId,
                    amount: razorpayOrder.amount,
                    currency: 'INR',
                    name: 'GoTravel',
                    description: pkg?.title || 'Trip Booking',
                    order_id: razorpayOrder.id,
                    handler: async (response: any) => {
                        try {
                            await bookingsApi.verifyPayment(newBooking._id, {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            });
                            toast.success('🎉 Booking confirmed!');
                            router.push(`/dashboard/bookings/${newBooking._id}`);
                        } catch {
                            toast.error('Payment failed. Please contact support.');
                        }
                    },
                    prefill: { name: form.contact.name, email: form.contact.email, contact: form.contact.phone },
                    theme: { color: '#FF6B35' },
                });
                rzp.open();
            };
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!pkg) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

    const totalCost = (pkg.discountedPrice || pkg.basePrice) * form.groupSize;

    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Progress steps */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {steps.map((step, i) => (
                            <div key={step} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentStep === i ? 'bg-brand-500 text-white' : currentStep > i ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                    {currentStep > i ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
                                    <span className="hidden sm:inline">{step}</span>
                                </div>
                                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Step 0: Summary */}
                            {currentStep === 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
                                    <h2 className="font-display text-2xl font-bold text-night-900">Trip Summary</h2>
                                    <div className="bg-brand-50 rounded-2xl p-5">
                                        <h3 className="font-semibold text-night-900 text-lg mb-3">{pkg.title}</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-brand-500" />{pkg.duration} Days / {pkg.nights} Nights</div>
                                            <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4 text-brand-500" />Max {pkg.maxGroupSize} per group</div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="text-sm font-medium text-night-900 block mb-2">Travel Date *</label>
                                            <input type="date" value={form.travelDate} onChange={e => setForm(p => ({ ...p, travelDate: e.target.value }))}
                                                min={new Date().toISOString().split('T')[0]} required className="input-field" />
                                        </div>
                                        <div className="mt-4">
                                            <label className="text-sm font-medium text-night-900 block mb-2">Number of Travelers</label>
                                            <div className="flex items-center gap-3">
                                                <button type="button" onClick={() => setForm(p => ({ ...p, groupSize: Math.max(1, p.groupSize - 1) }))} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-brand-50 text-night-900 font-bold transition-colors">-</button>
                                                <span className="text-xl font-bold w-8 text-center">{form.groupSize}</span>
                                                <button type="button" onClick={() => setForm(p => ({ ...p, groupSize: Math.min(20, p.groupSize + 1) }))} className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setCurrentStep(1)} disabled={!form.travelDate} className="btn-primary w-full justify-center py-4">Continue to Traveler Details →</button>
                                </motion.div>
                            )}

                            {/* Step 1: Traveler details */}
                            {currentStep === 1 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-5">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-display text-2xl font-bold text-night-900">Traveler Details</h2>
                                        <button onClick={addTraveler} className="text-sm text-brand-500 font-medium hover:text-brand-600">+ Add Traveler</button>
                                    </div>
                                    {form.travelers.slice(0, form.groupSize).map((t, i) => (
                                        <div key={i} className="border border-gray-100 rounded-2xl p-5 space-y-3">
                                            <h4 className="font-medium text-night-900 flex items-center gap-2"><User className="w-4 h-4 text-brand-500" />Traveler {i + 1} {i === 0 ? '(Primary)' : ''}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input value={t.name} onChange={e => updateTraveler(i, 'name', e.target.value)} placeholder="Full Name" required className="input-field text-sm" />
                                                <input type="number" value={t.age} onChange={e => updateTraveler(i, 'age', e.target.value)} placeholder="Age" required min={1} max={100} className="input-field text-sm" />
                                                <select value={t.gender} onChange={e => updateTraveler(i, 'gender', e.target.value)} className="input-field text-sm">
                                                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                                </select>
                                                <select value={t.idProofType} onChange={e => updateTraveler(i, 'idProofType', e.target.value)} className="input-field text-sm">
                                                    <option value="aadhar">Aadhar Card</option><option value="passport">Passport</option><option value="drivinglicense">Driving License</option>
                                                </select>
                                                <input value={t.idProofNumber} onChange={e => updateTraveler(i, 'idProofNumber', e.target.value)} placeholder="ID Proof Number" required className="input-field text-sm col-span-2" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(0)} className="btn-secondary flex-1 justify-center">← Back</button>
                                        <button onClick={() => setCurrentStep(2)} className="btn-primary flex-1 justify-center">Continue →</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Contact */}
                            {currentStep === 2 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
                                    <h2 className="font-display text-2xl font-bold text-night-900">Contact Information</h2>
                                    <input value={form.contact.name} onChange={e => setForm(p => ({ ...p, contact: { ...p.contact, name: e.target.value } }))} placeholder="Contact Name" required className="input-field" />
                                    <input type="email" value={form.contact.email} onChange={e => setForm(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))} placeholder="Email Address" required className="input-field" />
                                    <input type="tel" value={form.contact.phone} onChange={e => setForm(p => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))} placeholder="Phone Number" required className="input-field" />
                                    <textarea value={form.specialRequests} onChange={e => setForm(p => ({ ...p, specialRequests: e.target.value }))} placeholder="Special requests, dietary requirements, etc." rows={3} className="input-field" />
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
                                        <button onClick={() => setCurrentStep(3)} disabled={!form.contact.name || !form.contact.email || !form.contact.phone} className="btn-primary flex-1 justify-center">Review & Pay →</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Payment */}
                            {currentStep === 3 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-5">
                                    <h2 className="font-display text-2xl font-bold text-night-900">Review & Pay</h2>
                                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-medium">{pkg.title}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Travel Date</span><span className="font-medium">{form.travelDate}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Travelers</span><span className="font-medium">{form.groupSize}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="font-medium">{form.contact.email}</span></div>
                                        <hr />
                                        <div className="flex justify-between text-base font-bold text-night-900"><span>Total Amount</span><span className="text-brand-500">₹{totalCost?.toLocaleString('en-IN')}</span></div>
                                        <p className="text-xs text-gray-400">* Includes 5% GST. Free cancellation up to 30 days before travel.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(2)} className="btn-secondary flex-1 justify-center">← Back</button>
                                        <button onClick={initPayment} disabled={loading} className="btn-primary flex-1 justify-center py-4">
                                            <CreditCard className="w-5 h-5" />
                                            {loading ? 'Processing...' : `Pay ₹${totalCost?.toLocaleString('en-IN')}`}
                                        </button>
                                    </div>
                                    <div className="flex justify-center gap-4 text-xs text-gray-400">
                                        <span>🔒 256-bit SSL Encrypted</span>
                                        <span>💳 Powered by Razorpay</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Order summary sidebar */}
                        <div className="card p-6 h-fit sticky top-24">
                            <h3 className="font-semibold text-night-900 mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Package (×{form.groupSize})</span><span>₹{((pkg.discountedPrice || pkg.basePrice) * form.groupSize).toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Taxes (5% GST)</span><span>₹{Math.round((pkg.discountedPrice || pkg.basePrice) * form.groupSize * 0.05).toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between text-green-600"><span>Free Insurance</span><span>Included ✓</span></div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-bold text-night-900 text-base">
                                    <span>Total</span>
                                    <span className="text-brand-500">₹{(totalCost + Math.round(totalCost * 0.05)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
