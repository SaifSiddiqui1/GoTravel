'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, CheckCircle, XCircle } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reviews', { params: { page, limit: 15, status: filter !== 'all' ? filter : undefined } });
            setReviews(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchReviews(); }, [filter, page]);

    const approveReview = async (id: string) => {
        try {
            await api.patch(`/reviews/${id}/approve`);
            toast.success('Review approved and published!');
            fetchReviews();
        } catch { toast.error('Failed to approve review.'); }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Reviews & Testimonials</h1>
                    <p className="text-gray-500 text-sm">Manage user feedback</p>
                </div>
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map(s => (
                        <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">User & Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Destination</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Rating & Content</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? [...Array(4)].map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                                : reviews.map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-night-900">{r.userId?.name}</p>
                                            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{r.destinationId?.name}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-0.5 mb-1 text-yellow-400">
                                                {[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                                            </div>
                                            <p className="font-medium text-night-900 text-xs mb-1">{r.title}</p>
                                            <p className="text-gray-500 text-xs line-clamp-2">{r.body}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`badge capitalize ${r.isApproved === true ? 'bg-green-100 text-green-700' : r.isApproved === false ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {r.isApproved === true ? 'Approved' : r.isApproved === false ? 'Rejected' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.isApproved === null && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveReview(r._id)} className="p-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"><CheckCircle className="w-5 h-5" /></button>
                                                    <button onClick={() => toast.success('Review rejected')} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><XCircle className="w-5 h-5" /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {reviews.length === 0 && !loading && <div className="text-center py-12 text-gray-400">No reviews found in this category.</div>}
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {reviews.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={reviews.length < 15} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
