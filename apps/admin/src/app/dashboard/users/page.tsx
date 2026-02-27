'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetch = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users', { params: { page, limit: 20, search: search || undefined } });
            setUsers(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, [page]);

    const toggleBlock = async (id: string, isBlocked: boolean) => {
        try {
            await api.patch(`/admin/users/${id}/block`, { isBlocked: !isBlocked });
            toast.success(isBlocked ? 'User unblocked.' : 'User blocked.');
            fetch();
        } catch { toast.error('Action failed.'); }
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">User Management</h1>
                    <p className="text-gray-500 text-sm">{total} registered users</p>
                </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetch()}
                    placeholder="Search by name, email, or phone (press Enter)..." className="flex-1 outline-none text-sm placeholder:text-gray-400" />
                <button onClick={fetch} className="btn-primary">Search</button>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['User', 'Email', 'Phone', 'Bookings', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                                : users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">{u.name?.[0]?.toUpperCase()}</div>
                                                <div>
                                                    <p className="font-medium text-night-900">{u.name}</p>
                                                    <p className="text-xs text-gray-400">{u.city || u.state || 'User'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-4 py-4 text-gray-600">{u.phone || '—'}</td>
                                        <td className="px-4 py-4 font-medium">{u.totalBookings || 0}</td>
                                        <td className="px-4 py-4 font-medium text-green-600">₹{(u.totalSpent || 0).toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-4 py-4">
                                            <span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <a href={`/dashboard/users/${u._id}`} className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 transition-colors"><Eye className="w-4 h-4" /></a>
                                                <button onClick={() => toggleBlock(u._id, u.isBlocked)} className={`p-1.5 rounded-lg transition-colors ${u.isBlocked ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}>
                                                    {u.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && !loading && <div className="text-center py-12 text-gray-400">No users found.</div>}
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {users.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={users.length < 20} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
