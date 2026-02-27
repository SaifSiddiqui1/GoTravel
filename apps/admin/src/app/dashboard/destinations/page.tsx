'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Plus, MapPin, Tag, Edit, Trash2 } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/destinations', { params: { page, limit: 12, search: search || undefined } });
            setDestinations(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchDestinations(); }, [page]);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Destinations Management</h1>
                    <p className="text-gray-500 text-sm">{total} active destinations on platform</p>
                </div>
                <button className="btn-primary" onClick={() => toast.error('Creation modal not implemented in demo')}><Plus className="w-4 h-4" /> Add Destination</button>
            </div>

            <div className="card p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchDestinations()} placeholder="Search destinations by name or state..." className="flex-1 outline-none text-sm text-night-900 placeholder:text-gray-400" />
                <button onClick={fetchDestinations} className="btn-primary py-2 px-4">Search</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />)}
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">No destinations found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {destinations.map(d => (
                        <div key={d._id} className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className="h-40 bg-gray-200 relative">
                                {d.images?.[0] && <img src={d.images[0].url} alt={d.name} className="w-full h-full object-cover" />}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-night-900">
                                    ★ {d.averageRating?.toFixed(1) || 'New'}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-night-900 text-lg mb-1">{d.name}</h3>
                                <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3"><MapPin className="w-3.5 h-3.5 text-brand-500" /> {d.state}, India</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="badge bg-gray-100 text-gray-600 flex items-center gap-1"><Tag className="w-3 h-3" /> {d.difficultyLevel || 'Easy'}</span>
                                </div>
                                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                                    <span className="text-sm font-semibold text-brand-500">Starts at ₹{d.startingPrice?.toLocaleString('en-IN') || '0'}</span>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {destinations.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={destinations.length < 12} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
