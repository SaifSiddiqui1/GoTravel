'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Phone, Mail, ChevronDown, Eye } from 'lucide-react';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => { const t = typeof window !== 'undefined' && localStorage.getItem('gt_admin_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

const statusColors: Record<string, string> = { new: 'bg-brand-100 text-brand-700', contacted: 'bg-blue-100 text-blue-700', converted: 'bg-green-100 text-green-700', lost: 'bg-red-100 text-red-700' };

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page, limit: 15 };
            if (filter !== 'all') params.status = filter;
            const res = await api.get('/leads', { params });
            setLeads(res.data.data || []);
            setTotal(res.data.pagination?.total || 0);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchLeads(); }, [filter, page]);

    const updateStatus = async (id: string, status: string, notes?: string) => {
        try {
            await api.patch(`/leads/${id}/status`, { status, adminNotes: notes });
            toast.success('Lead updated!');
            fetchLeads();
        } catch { toast.error('Update failed.'); }
    };

    const filtered = search ? leads.filter(l =>
        l.contactDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.contactDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.contactDetails?.phone?.includes(search)
    ) : leads;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Lead Management</h1>
                    <p className="text-gray-500 text-sm">{total} total leads</p>
                </div>
                <div className="flex gap-3">
                    {['all', 'new', 'contacted', 'converted', 'lost'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-50'}`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="card p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone..." className="flex-1 outline-none text-sm text-night-900 placeholder:text-gray-400" />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Contact', 'Destination', 'Group Size', 'Budget', 'Preferred Dates', 'Status', 'Time', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                            )) : filtered.map(lead => (
                                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-night-900">{lead.contactDetails?.name}</p>
                                        <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                            <a href={`tel:${lead.contactDetails?.phone}`} className="flex items-center gap-1 hover:text-brand-500"><Phone className="w-3 h-3" />{lead.contactDetails?.phone}</a>
                                            <a href={`mailto:${lead.contactDetails?.email}`} className="flex items-center gap-1 hover:text-brand-500"><Mail className="w-3 h-3" />{lead.contactDetails?.email?.split('@')[0]}@...</a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-night-900">{lead.destinationId?.name || '—'}</td>
                                    <td className="px-4 py-4 text-gray-600">{lead.groupSize}</td>
                                    <td className="px-4 py-4 text-gray-600">{lead.budget || '—'}</td>
                                    <td className="px-4 py-4 text-gray-600">{lead.preferredDates || '—'}</td>
                                    <td className="px-4 py-4">
                                        <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)}
                                            className={`badge py-1.5 font-semibold cursor-pointer border-none outline-none ${statusColors[lead.status]}`}
                                        >
                                            {['new', 'contacted', 'converted', 'lost'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-gray-400 text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}<br />{new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="px-4 py-4">
                                        <a href={`/dashboard/leads/${lead._id}`} className="text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"><Eye className="w-4 h-4" />View</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400">No leads found matching your criteria.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {filtered.length} of {total}</p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">← Prev</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={filtered.length < 15} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 disabled:opacity-40">Next →</button>
                </div>
            </div>
        </div>
    );
}
