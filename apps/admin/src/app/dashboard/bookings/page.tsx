'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Eye } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

const statusColors: Record<string, string> = { enquiry: 'bg-gray-100 text-gray-600', confirmed: 'bg-green-100 text-green-700', departed: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };
const paymentColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700' };

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetch = async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page, limit: 15 };
            if (statusFilter !== 'all') params.status = statusFilter;
            const res = await api.get('/bookings', { params });
            setBookings(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, [statusFilter, page]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            toast.success('Booking status updated!');
            fetch();
        } catch { toast.error('Update failed.'); }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Bookings Management</h1>
                    <p className="text-gray-500 text-sm">{total} total bookings</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'enquiry', 'confirmed', 'departed', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-50'}`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Ref', 'User', 'Destination', 'Travel Date', 'Travelers', 'Amount', 'Payment', 'Status', 'Action'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={9} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                                : bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-mono text-xs text-brand-600 font-semibold">{b.bookingRef}</td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium">{b.userId?.name}</p>
                                            <p className="text-xs text-gray-400">{b.userId?.phone}</p>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{b.destinationId?.name}</td>
                                        <td className="px-4 py-4">{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '—'}</td>
                                        <td className="px-4 py-4">{b.totalTravelers}</td>
                                        <td className="px-4 py-4 font-semibold">₹{b.totalCost?.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-4"><span className={`badge capitalize ${paymentColors[b.paymentStatus] || 'bg-gray-100'}`}>{b.paymentStatus}</span></td>
                                        <td className="px-4 py-4">
                                            <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                                                className={`badge capitalize cursor-pointer border-none outline-none text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100'}`}
                                            >
                                                {['enquiry', 'confirmed', 'departed', 'completed', 'cancelled'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4">
                                            <a href={`/dashboard/bookings/${b._id}`} className="text-brand-500 hover:text-brand-600 flex items-center gap-1 text-xs font-medium">
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {bookings.length === 0 && !loading && <div className="text-center py-12 text-gray-400">No bookings found.</div>}
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {bookings.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={bookings.length < 15} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
