'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.login(form);
            localStorage.setItem('gt_token', res.data.token);
            localStorage.setItem('gt_user', JSON.stringify(res.data.data));
            toast.success(`Welcome back, ${res.data.data.name}!`);
            router.push(res.data.data.role === 'user' ? '/dashboard' : '/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Image */}
            <div className="hidden lg:block flex-1 relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2000)' }} />
                <div className="absolute inset-0 bg-gradient-dark opacity-80" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-12">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-2xl">G</div>
                        <span className="text-3xl font-display font-bold text-white">Go<span className="text-brand-400">Travel</span></span>
                    </Link>
                    <h2 className="font-display text-4xl font-bold text-white mb-4">Your Next Adventure Awaits</h2>
                    <p className="text-white/70 text-lg">Sign in to access your bookings, custom itineraries, and exclusive travel deals.</p>
                </div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">G</div>
                            <span className="text-2xl font-display font-bold text-night-900">Go<span className="text-brand-500">Travel</span></span>
                        </Link>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-night-900 mb-2">Welcome back!</h1>
                    <p className="text-gray-500 mb-8">Sign in to continue your travel journey.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-night-900 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="you@example.com" required className="input-field pl-12" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="text-sm font-medium text-night-900">Password</label>
                                <Link href="/auth/forgot-password" className="text-sm text-brand-500 hover:text-brand-600">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder="••••••••" required className="input-field pl-12 pr-12" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base mt-6">
                            {loading ? 'Signing in...' : <><ArrowRight className="w-5 h-5" /> Sign In</>}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="text-brand-500 font-semibold hover:text-brand-600">Create Account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
