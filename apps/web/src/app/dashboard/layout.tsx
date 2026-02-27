'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, User, LogOut, ChevronRight, Compass } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const navItems = [
    { label: 'My Trips', href: '/dashboard', icon: Package },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('gt_token');
        const userStr = localStorage.getItem('gt_user');
        if (!token) { router.push('/auth/login'); return; }
        if (userStr) {
            try { setUser(JSON.parse(userStr)); } catch (_) { }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('gt_token');
        localStorage.removeItem('gt_user');
        router.push('/');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-2xl shadow-brand">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-night-900">Welcome, {user.name?.split(' ')[0]}</h1>
                            <p className="text-gray-500 text-sm">Manage your bookings, custom itineraries, and profile settings.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-2">
                            <nav className="card p-3 space-y-1">
                                {navItems.map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50 hover:text-night-900'}`}>
                                            <div className="flex items-center gap-3"><item.icon className="w-5 h-5" /> {item.label}</div>
                                            {isActive && <ChevronRight className="w-4 h-4" />}
                                        </Link>
                                    );
                                })}
                                <hr className="my-2 border-gray-100" />
                                <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                                    <div className="flex items-center gap-3"><LogOut className="w-5 h-5" /> Sign Out</div>
                                </button>
                            </nav>

                            {/* Promo Card */}
                            <div className="card p-5 bg-gradient-dark text-white border-0 mt-4 overflow-hidden relative">
                                <div className="absolute -right-6 -bottom-6 opacity-20"><Compass className="w-32 h-32" /></div>
                                <h3 className="font-bold mb-2 relative z-10">Refer a Friend</h3>
                                <p className="text-xs text-white/70 mb-4 relative z-10">Get ₹1000 off on your next trip when a friend books with us!</p>
                                <button className="px-4 py-2 bg-brand-500 rounded-lg text-xs font-bold w-full relative z-10 hover:bg-brand-600 transition-colors">Get Invite Link</button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                {children}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
