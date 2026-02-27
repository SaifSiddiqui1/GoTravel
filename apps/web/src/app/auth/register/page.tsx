'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.register(form);
            localStorage.setItem('gt_token', res.data.token);
            localStorage.setItem('gt_user', JSON.stringify(res.data.data));
            toast.success('Account created! Welcome to GoTravel 🎉');
            router.push('/destinations');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:block flex-1 relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000)' }} />
                <div className="absolute inset-0 bg-gradient-dark opacity-80" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-12">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-2xl">G</div>
                        <span className="text-3xl font-display font-bold text-white">Go<span className="text-brand-400">Travel</span></span>
                    </Link>
                    <h2 className="font-display text-4xl font-bold text-white mb-4">Join 50,000+ Travelers</h2>
                    <p className="text-white/70 text-lg">Create your account and start booking unforgettable Indian travel experiences today.</p>
                    <div className="flex gap-6 mt-8 text-white/70 text-sm">
                        <div className="text-center"><p className="text-white font-bold text-2xl">50K+</p><p>Happy Travelers</p></div>
                        <div className="text-center"><p className="text-white font-bold text-2xl">150+</p><p>Destinations</p></div>
                        <div className="text-center"><p className="text-white font-bold text-2xl">4.8★</p><p>Avg. Rating</p></div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">G</div>
                            <span className="text-2xl font-display font-bold text-night-900">Go<span className="text-brand-500">Travel</span></span>
                        </Link>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-night-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-8">Start your journey with GoTravel today.</p>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" required className="input-field pl-12" />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email Address" required className="input-field pl-12" />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone Number" className="input-field pl-12" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Password (min. 8 characters)" required minLength={8} className="input-field pl-12" />
                        </div>
                        <p className="text-xs text-gray-400">By creating an account, you agree to our <Link href="/terms" className="text-brand-500">Terms</Link> and <Link href="/privacy" className="text-brand-500">Privacy Policy</Link>.</p>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                            {loading ? 'Creating Account...' : <><ArrowRight className="w-5 h-5" /> Create Account</>}
                        </button>
                    </form>
                    <p className="text-center text-gray-500 text-sm mt-8">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-brand-500 font-semibold hover:text-brand-600">Sign In</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
