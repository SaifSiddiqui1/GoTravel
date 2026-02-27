'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingsApi } from '@/lib/api';
import { ArrowLeft, MapPin, Calendar, Users, Map, Clock, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = { enquiry: 'bg-gray-100 text-gray-700', confirmed: 'bg-green-100 text-green-700', departed: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };

export default function BookingDetailPage({ params }: { params: { id: string } }) {
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bookingsApi.detail(params.id)
            .then(res => setBooking(res.data.data))
            .catch(() => toast.error('Failed to load booking details'))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-2xl" /></div>;
    if (!booking) return <div className="text-center py-12">Booking not found.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="text-sm text-brand-500 font-medium hover:text-brand-600 flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Trips
                    </Link>
                    <div className="flex items-center gap-3">
                        <h2 className="font-display text-2xl font-bold text-night-900">Booking #{booking.bookingRef}</h2>
                        <span className={`badge capitalize ${statusColors[booking.status] || 'bg-gray-100'}`}>{booking.status}</span>
                    </div>
                </div>
                <button className="btn-secondary py-2 text-sm bg-white print:hidden" onClick={() => window.print()}>
                    <Download className="w-4 h-4" /> Download/Print Invoice
                </button>
            </div>

            <div className="hidden print:block mb-8 pb-4 border-b-2 border-night-900">
                <h1 className="text-3xl font-display font-bold text-night-900 mb-2">GoTravel Invoice</h1>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p className="text-sm text-gray-500">Ref: {booking.bookingRef}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Col */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overview */}
                    <div className="card p-6">
                        <h3 className="font-bold text-night-900 mb-4 border-b border-gray-100 pb-3">Trip Overview</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Destination</p>
                                    <p className="font-semibold text-night-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" />{booking.destinationId?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Package</p>
                                    <p className="font-semibold text-night-900 flex items-center gap-2"><Map className="w-4 h-4 text-brand-500" />{booking.packageId?.title}</p>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Travel Date</p>
                                    <p className="font-semibold text-night-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-500" />{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN') : 'TBD'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Travelers</p>
                                    <p className="font-semibold text-night-900 flex items-center gap-2"><Users className="w-4 h-4 text-brand-500" />{booking.totalTravelers} People</p>
                                </div>
                            </div>
                        </div>

                        {/* Added FIT items if any */}
                        {booking.fitAddOns?.length > 0 && (
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <p className="text-sm font-semibold text-night-900 mb-3">Extras & Add-ons</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {booking.fitAddOns.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-brand-500" /> {item.name || 'Custom Add-on'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Travelers List */}
                    <div className="card p-6">
                        <h3 className="font-bold text-night-900 mb-4 border-b border-gray-100 pb-3">Traveler Details</h3>
                        <div className="divide-y divide-gray-100">
                            {booking.travelers?.map((t: any, i: number) => (
                                <div key={i} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-night-900 text-sm">{t.name} <span className="text-xs font-normal text-gray-500">({t.age} yrs, {t.gender})</span></p>
                                        <p className="text-xs text-gray-400 mt-0.5 uppercase">{t.idProofType}: {t.idProofNumber}</p>
                                    </div>
                                    {i === 0 && <span className="badge bg-brand-50 text-brand-600">Primary</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="card p-6">
                        <h3 className="font-bold text-night-900 mb-4 border-b border-gray-100 pb-3">Payment Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600"><span>Booking Amount</span><span>₹{booking.totalCost?.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Taxes Included</span><span>₹{Math.round(booking.totalCost * 0.05).toLocaleString('en-IN')}</span></div>
                            <hr className="my-2 border-dashed border-gray-200" />
                            <div className="flex justify-between font-bold text-night-900 text-lg">
                                <span>Total Paid</span>
                                <span className="text-brand-500">₹{booking.totalCost?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <div className={`mt-5 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold capitalize ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            Status: {booking.paymentStatus}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="card p-6 bg-night-900 text-white border-0">
                        <h3 className="font-bold mb-2">Need Trip Support?</h3>
                        <p className="text-white/60 text-sm mb-4">Our travel experts are available 24/7 to assist you with your booking.</p>
                        <div className="space-y-2 text-sm">
                            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-brand-400"><Clock className="w-4 h-4" /> Call: +91 98765 43210</a>
                            <a href="mailto:support@gotravel.in" className="flex items-center gap-2 hover:text-brand-400"><Clock className="w-4 h-4" /> Email: support@gotravel.in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
