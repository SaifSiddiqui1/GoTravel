'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, form);
            const user = res.data.data;
            if (!['admin', 'superadmin'].includes(user.role)) {
                toast.error('Access denied. Admin only.');
                return;
            }
            localStorage.setItem('gt_admin_token', res.data.token);
            localStorage.setItem('gt_admin_user', JSON.stringify(user));
            toast.success(`Welcome, ${user.name}!`);
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-night-900 via-night-800 to-night-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">G</div>
                    <h1 className="text-2xl font-bold text-night-900">GoTravel Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to manage your travel platform</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@gotravel.in" required className="input-field pl-12" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required className="input-field pl-12 pr-12" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                        {loading ? 'Signing in...' : 'Sign In to Admin'}
                    </button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-6">GoTravel Admin Panel · Restricted Access</p>
            </div>
        </div>
    );
}
