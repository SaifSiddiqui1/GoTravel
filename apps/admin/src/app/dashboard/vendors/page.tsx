'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Plus, Star, MapPin, Store, Phone } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export default function VendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vendors', { params: { page, limit: 15, search: search || undefined } });
            setVendors(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchVendors(); }, [page]);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Vendor Management</h1>
                    <p className="text-gray-500 text-sm">{total} partners across India</p>
                </div>
                <button className="btn-primary" onClick={() => toast.error('Creation modal not implemented in demo')}><Plus className="w-4 h-4" /> Add Vendor</button>
            </div>

            {/* Search */}
            <div className="card p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchVendors()} placeholder="Search by name, city, or service type..." className="flex-1 outline-none text-sm text-night-900 placeholder:text-gray-400" />
                <button onClick={fetchVendors} className="btn-primary py-2 px-4">Search</button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />)}
                </div>
            ) : vendors.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">No vendors found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendors.map(v => (
                        <div key={v._id} className="card p-5 hover:border-brand-200 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-600"><Store className="w-5 h-5" /></div>
                                    <div>
                                        <h3 className="font-bold text-night-900 text-sm">{v.name}</h3>
                                        <p className="text-xs text-gray-400 capitalize">{v.serviceType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                    <Star className="w-3 h-3 fill-current" /> {v.rating?.toFixed(1) || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {v.city}, {v.state}</p>
                                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {v.contactPerson?.phone || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className={`badge ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v.isActive ? 'Active' : 'Inactive'}</span>
                                <button onClick={() => toast.success('View details open')} className="text-brand-500 font-medium text-sm hover:text-brand-600">Manage →</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {vendors.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={vendors.length < 15} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
