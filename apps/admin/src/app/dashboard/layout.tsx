'use client';
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Users, MapPin, Package, FileText, Star,
    Store, BarChart2, Settings, LogOut, ChevronLeft, Bell, Menu
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads', href: '/dashboard/leads', icon: FileText },
    { label: 'Bookings', href: '/dashboard/bookings', icon: Package },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Vendors', href: '/dashboard/vendors', icon: Store },
    { label: 'Destinations', href: '/dashboard/destinations', icon: MapPin },
    { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('gt_admin_token');
        const userStr = localStorage.getItem('gt_admin_user');
        if (!token) { router.push('/'); return; }
        if (userStr) try { setUser(JSON.parse(userStr)); } catch (_) { }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('gt_admin_token');
        localStorage.removeItem('gt_admin_user');
        router.push('/');
    };

    const Sidebar = () => (
        <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-night-900 flex flex-col transition-all duration-300 flex-shrink-0`}>
            {/* Logo */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">G</div>
                        <span className="text-white font-bold">GoTravel</span>
                        <span className="text-brand-400 text-xs font-medium px-1.5 py-0.5 bg-brand-500/20 rounded">ADMIN</span>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)} className="text-white/40 hover:text-white p-1">
                    <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {navItems.map(item => (
                    <Link key={item.href} href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                                ? 'bg-brand-500 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* User info */}
            {user && !collapsed && (
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">{user.name?.[0]}</div>
                        <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-white/40 text-xs capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            )}
            {collapsed && (
                <button onClick={handleLogout} className="p-4 border-t border-white/10 flex justify-center text-white/40 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                </button>
            )}
        </aside>
    );

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-gray-500 hover:text-night-900">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-night-900 font-semibold capitalize">
                        {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-500 hover:text-night-900 hover:bg-gray-100 rounded-xl transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
                        </button>
                        <Link href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} target="_blank"
                            className="text-xs text-gray-500 hover:text-brand-500 border border-gray-200 px-3 py-1.5 rounded-xl transition-colors">
                            View Site ↗
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
