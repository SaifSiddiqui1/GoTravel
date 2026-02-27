'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingsApi } from '@/lib/api';
import { MapPin, Calendar, Users, Eye, Clock, CreditCard } from 'lucide-react';

const statusColors: Record<string, string> = { enquiry: 'bg-gray-100 text-gray-700', confirmed: 'bg-green-100 text-green-700', departed: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };
const paymentColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700' };

export default function DashboardMyTrips() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bookingsApi.myBookings()
            .then(res => setBookings(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-night-900 mb-6">My Trips</h2>
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-gray-200 animate-pulse" />)}
        </div>
    );

    return (
        <div>
            <h2 className="font-display text-xl font-bold text-night-900 mb-6">My Trips & Bookings</h2>

            {bookings.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-night-900 text-lg mb-2">No trips booked yet</h3>
                    <p className="text-gray-500 mb-6">It looks like you haven't booked any adventures with us.</p>
                    <Link href="/destinations" className="btn-primary">Explore Destinations</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="card p-5 hover:border-brand-200 transition-colors group">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-mono font-semibold text-brand-500 bg-brand-50 px-2 py-1 rounded">#{booking.bookingRef}</span>
                                        <span className={`badge capitalize ${statusColors[booking.status] || 'bg-gray-100'}`}>{booking.status}</span>
                                    </div>
                                    <h3 className="font-bold text-night-900 text-lg lg:text-xl mb-1">{booking.destinationId?.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{booking.packageId?.title}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-500 font-medium" />{new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-500 font-medium" />{booking.totalTravelers} Travelers</div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-start sm:items-end border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 min-w-[150px]">
                                    <div className="mb-4 sm:mb-0 w-full">
                                        <p className="text-xs text-gray-400 mb-1">Total Cost</p>
                                        <p className="font-bold text-night-900 text-xl">₹{booking.totalCost?.toLocaleString('en-IN')}</p>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                            <span className={`text-xs font-medium capitalize ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/bookings/${booking._id}`} className="btn-secondary w-full justify-center py-2.5 text-sm group-hover:bg-brand-50">
                                        <Eye className="w-4 h-4" /> View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
