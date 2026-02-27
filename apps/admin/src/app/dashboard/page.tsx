'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { DollarSign, Users, FileText, Package, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use(cfg => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gt_admin_token');
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

function StatCard({ title, value, icon: Icon, color, sub }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-night-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/revenue-chart?period=30'),
        ])
            .then(([statsRes, revenueRes]) => {
                setStats(statsRes.data.data);
                setRevenueData(revenueRes.data.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-200 animate-pulse" />)}
            </div>
        </div>
    );

    const statCards = [
        { title: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-green-500', sub: `₹${((stats?.monthRevenue || 0) / 100000).toFixed(1)}L this month` },
        { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: Package, color: 'bg-blue-500', sub: `${stats?.todayBookings || 0} today` },
        { title: 'Confirmed Bookings', value: stats?.confirmedBookings || 0, icon: CheckCircle, color: 'bg-emerald-500' },
        { title: 'Total Leads', value: stats?.totalLeads || 0, icon: FileText, color: 'bg-brand-500', sub: `${stats?.newLeads || 0} new & uncontacted` },
        { title: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-purple-500' },
        { title: 'New Leads Today', value: stats?.newLeads || 0, icon: AlertCircle, color: 'bg-orange-500' },
        { title: 'Conversion Rate', value: `${stats?.totalLeads > 0 ? Math.round((stats?.confirmedBookings / stats?.totalLeads) * 100) : 0}%`, icon: TrendingUp, color: 'bg-indigo-500' },
        { title: 'This Month Revenue', value: `₹${((stats?.monthRevenue || 0) / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-teal-500' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-night-900">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Last updated: {new Date().toLocaleString('en-IN')}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue chart */}
                <div className="card p-5">
                    <h3 className="font-semibold text-night-900 mb-5">Revenue (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tickFormatter={v => v.slice(5)} tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bookings chart */}
                <div className="card p-5">
                    <h3 className="font-semibold text-night-900 mb-5">Daily Bookings (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tickFormatter={v => v.slice(5)} tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent leads */}
                <div className="card p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-night-900">New Leads</h3>
                        <a href="/dashboard/leads" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View All →</a>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentLeads?.map((lead: any) => (
                            <div key={lead._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors">
                                <div>
                                    <p className="font-medium text-night-900 text-sm">{lead.contactDetails?.name}</p>
                                    <p className="text-xs text-gray-400">{lead.destinationId?.name} · {lead.contactDetails?.phone}</p>
                                </div>
                                <span className="badge bg-orange-100 text-orange-700">New</span>
                            </div>
                        ))}
                        {!stats?.recentLeads?.length && <p className="text-gray-400 text-sm text-center py-4">No new leads</p>}
                    </div>
                </div>

                {/* Recent bookings */}
                <div className="card p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-night-900">Recent Bookings</h3>
                        <a href="/dashboard/bookings" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View All →</a>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentBookings?.map((b: any) => (
                            <div key={b._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div>
                                    <p className="font-medium text-night-900 text-sm">{b.userId?.name}</p>
                                    <p className="text-xs text-gray-400">{b.destinationId?.name} · ₹{b.totalCost?.toLocaleString('en-IN')}</p>
                                </div>
                                <span className={`badge capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {b.status}
                                </span>
                            </div>
                        ))}
                        {!stats?.recentBookings?.length && <p className="text-gray-400 text-sm text-center py-4">No recent bookings</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
